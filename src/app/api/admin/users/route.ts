import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { createAuditLog } from "@/lib/audit";
import { getAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {

  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();


    if (authError || !user) {

      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin (simple check)
    const { data: userData, error: roleError } = await supabase
      .from("users")
      .select("role, institution_id")
      .eq("id", user.id)
      .single();



    if (roleError || !userData) {

      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (userData.role !== "ADMIN" && userData.role !== "SUPER_ADMIN") {

      return NextResponse.json({ error: "Forbidden: Admin only" }, { status: 403 });
    }

    const body = await request.json();


    const { email, password, full_name, role, pin_number, branch_id, admission_year } = body;

    // Validate required fields
    if (!email || !password || !full_name) {
      return NextResponse.json({ error: "Email, password, and full name are required" }, { status: 400 });
    }

    const institution_id = userData.institution_id;


    if (!institution_id) {
      return NextResponse.json({ error: "Admin has no institution assigned. Please contact super admin." }, { status: 400 });
    }

    // 1. Create user in Auth (using Service Role)
    const adminClient = getAdminClient();


    const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name },
    });



    // Handle "email already exists" error - just throw a clearer message
    if (createError) {
      if (createError.message?.includes('email_exists') || (createError as any).status === 422) {
        throw new Error("A user with this email address has already been registered");
      }
      throw createError;
    }

    if (!newUser?.user) throw new Error("Failed to create user");

    // 2. Update Public Users Role
    // Note: password_hash is required but we can't get it from Auth. 
    // Using placeholder - in production, use Supabase trigger

    const { error: userUpsertError } = await adminClient
      .from("users")
      .upsert({
        id: newUser.user.id,
        email: newUser.user.email!,
        password_hash: "managed_by_supabase_auth",
        role: role || "STUDENT",
        is_active: true,
        institution_id
      }, { onConflict: 'id', ignoreDuplicates: true });



    if (userUpsertError) {
      // Try insert instead if upsert fails

      const { error: insertError } = await adminClient
        .from("users")
        .insert({
          id: newUser.user.id,
          email: newUser.user.email!,
          password_hash: "managed_by_supabase_auth",
          role: role || "STUDENT",
          is_active: true,
          institution_id
        });
      if (insertError && !insertError.message.includes('duplicate')) {
        throw insertError;
      }
    }

    // 3. Update Profile

    const { error: profileError } = await adminClient
      .from("profiles")
      .upsert({
        id: newUser.user.id,  // Use id, not user_id
        user_id: newUser.user.id,
        full_name,
        pin_number,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id', ignoreDuplicates: true });



    if (profileError) throw profileError;

    // 4. If Faculty or Student, create specific record
    if (role === 'FACULTY') {

      const { error: facultyError } = await adminClient.from('faculty').upsert({
        user_id: newUser.user.id,
        institution_id,
        employee_id: pin_number || `EMP-${Date.now()}`,
        branch_id: branch_id || null
      }, { onConflict: 'user_id', ignoreDuplicates: true });

      if (facultyError) throw facultyError;
    } else if (role === 'STUDENT') {

      if (!branch_id || !admission_year) {
        throw new Error("Branch and Admission Year are required for Students");
      }
      const { error: studentError } = await adminClient.from('students').upsert({
        user_id: newUser.user.id,
        institution_id,
        branch_id,
        pin_number,
        admission_year: parseInt(admission_year),
        academic_year: "YEAR_1",
        current_semester: "SEM_1"
      }, { onConflict: 'user_id', ignoreDuplicates: true });

      if (studentError) throw studentError;
    }

    createAuditLog({
      action: "create",
      entity_type: "user",
      entity_id: newUser.user.id,
      new_values: { email, role },
    });


    return NextResponse.json({ user: newUser.user, message: "User created successfully" });
  } catch (error: any) {
    console.error("[CREATE USER] ERROR:", error);
    return NextResponse.json({ error: error.message || "Internal server error", details: error.toString() }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Simple role check
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!userData || (userData.role !== "ADMIN" && userData.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || "100";
    const offset = searchParams.get("offset") || "0";
    const role = searchParams.get("role");

    let query = supabase
      .from("users")
      .select(`
        id,
        email,
        role,
        is_active,
        created_at,
        profile:profiles (full_name)
      `)
      .neq("role", "SUPER_ADMIN")
      .order("created_at", { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (role) {
      query = query.eq("role", role);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ users: data });
  } catch (error: any) {
    console.error("Get users error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
