import react, { useEffect, useMemo, useState } from "react";

const statusStyles = {
  Active: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Review: "bg-amber-100 text-amber-700 border-amber-200",
  Draft: "bg-slate-100 text-slate-700 border-slate-200",
  Archived: "bg-rose-100 text-rose-700 border-rose-200",
};

function Badge({ children, tone = "default" }) {
  const tones = {
    default: "bg-slate-100 text-slate-700",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
  };

  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}

function Panel({ title, subtitle, actions, children }) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          {subtitle ? <p className="text-sm font-medium text-slate-500">{subtitle}</p> : null}
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h2>
        </div>
        {actions ? <div>{actions}</div> : null}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">{label}</label>
      {children}
    </div>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-500"
    />
  );
}

function Textarea(props) {
  return (
    <textarea
      {...props}
      className="min-h-[110px] w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-500"
    />
  );
}

function Select(props) {
  return (
    <select
      {...props}
      className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-500"
    />
  );
}

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Opspecs Hub</p>
        <h1 className="mt-3 text-2xl font-semibold">Loading your workspace...</h1>
      </div>
    </div>
  );
}

function LoginScreen({ onSubmit, loading, error }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-6 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div>
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
            Private internal knowledge system
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
            Secure access for your company opspecs library.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
            Employees sign in to view published opspecs. Only users with the admin role can create, edit, archive, and publish documents.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              ["Viewer access", "Read-only access to published opspecs"],
              ["Admin access", "Create and manage specs behind role-based auth"],
              ["Backend rules", "Permissions are enforced by Supabase policies"],
            ].map(([title, text]) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white p-6 text-slate-900 shadow-2xl shadow-black/30 md:p-8">
          <div>
            <p className="text-sm font-medium text-slate-500">Authentication</p>
            <h2 className="text-2xl font-semibold tracking-tight">Sign in</h2>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(email, password);
            }}
            className="mt-6 space-y-4"
          >
            <Field label="Email">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                autoComplete="email"
              />
            </Field>

            <Field label="Password">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </Field>

            {error ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
            ) : null}

            <button
              disabled={loading}
              className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Continue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function SpecCard({ spec }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700">{spec.id}</span>
            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-600">{spec.category}</span>
          </div>
          <h4 className="mt-3 text-xl font-semibold tracking-tight">{spec.title}</h4>
          <p className="mt-2 text-sm leading-6 text-slate-600">{spec.summary}</p>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[spec.status] || statusStyles.Draft}`}>
          {spec.status}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Owner</p>
          <p className="mt-1 text-sm font-medium text-slate-700">{spec.owner || "—"}</p>
        </div>
        <div className="rounded-2xl bg-white p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Team</p>
          <p className="mt-1 text-sm font-medium text-slate-700">{spec.team || "—"}</p>
        </div>
        <div className="rounded-2xl bg-white p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Version</p>
          <p className="mt-1 text-sm font-medium text-slate-700">{spec.version || "—"}</p>
        </div>
        <div className="rounded-2xl bg-white p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Updated</p>
          <p className="mt-1 text-sm font-medium text-slate-700">{spec.updated_at ? new Date(spec.updated_at).toLocaleDateString() : "—"}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {(spec.tags || []).map((tag) => (
          <span key={tag} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
            #{tag}
          </span>
        ))}
      </div>
    </article>
  );
}

function ViewerDashboard({ user, specs, search, setSearch, selectedTeam, setSelectedTeam, selectedStatus, setSelectedStatus, onSignOut }) {
  const teams = useMemo(() => ["All teams", ...Array.from(new Set(specs.map((s) => s.team).filter(Boolean)))], [specs]);
  const statuses = ["All statuses", "Active", "Review", "Draft", "Archived"];

  const filteredSpecs = useMemo(() => {
    return specs.filter((spec) => {
      const haystack = [spec.id, spec.title, spec.team, spec.owner, spec.category, spec.summary, ...(spec.tags || [])]
        .join(" ")
        .toLowerCase();
      const matchesSearch = !search || haystack.includes(search.toLowerCase());
      const matchesTeam = selectedTeam === "All teams" || spec.team === selectedTeam;
      const matchesStatus = selectedStatus === "All statuses" || spec.status === selectedStatus;
      return matchesSearch && matchesTeam && matchesStatus;
    });
  }, [specs, search, selectedTeam, selectedStatus]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white shadow-sm">OP</div>
            <div>
              <p className="text-sm font-medium text-slate-500">Internal Knowledge Portal</p>
              <h1 className="text-xl font-semibold tracking-tight">Opspecs Hub</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge tone="success">Viewer</Badge>
            <span className="hidden text-sm text-slate-500 md:inline">{user?.email}</span>
            <button onClick={onSignOut} className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <Panel title="Published opspecs" subtitle="Read-only access for company members">
          <div className="grid gap-3 sm:grid-cols-3">
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search specs" />
            <Select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)}>
              {teams.map((team) => (
                <option key={team}>{team}</option>
              ))}
            </Select>
            <Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
              {statuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </Select>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {filteredSpecs.length ? filteredSpecs.map((spec) => <SpecCard key={spec.id} spec={spec} />) : <p className="text-sm text-slate-500">No specs found.</p>}
          </div>
        </Panel>
      </main>
    </div>
  );
}

function AdminDashboard({ user, specs, form, setForm, selectedSpecId, setSelectedSpecId, saving, onCreate, onPublishToggle, onSignOut }) {
  const selectedSpec = specs.find((spec) => spec.id === selectedSpecId) || null;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white shadow-sm">AD</div>
            <div>
              <p className="text-sm font-medium text-slate-500">Restricted management area</p>
              <h1 className="text-xl font-semibold tracking-tight">Opspecs Admin</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge tone="warning">Admin</Badge>
            <span className="hidden text-sm text-slate-500 md:inline">{user?.email}</span>
            <button onClick={onSignOut} className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="space-y-6">
          <Panel title="Create document" subtitle="Draft new opspecs for review and publishing">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onCreate();
              }}
              className="space-y-4"
            >
              <Field label="Spec ID"><Input value={form.id} onChange={(e) => setForm((v) => ({ ...v, id: e.target.value }))} /></Field>
              <Field label="Title"><Input value={form.title} onChange={(e) => setForm((v) => ({ ...v, title: e.target.value }))} /></Field>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Owner"><Input value={form.owner} onChange={(e) => setForm((v) => ({ ...v, owner: e.target.value }))} /></Field>
                <Field label="Team"><Input value={form.team} onChange={(e) => setForm((v) => ({ ...v, team: e.target.value }))} /></Field>
                <Field label="Category"><Input value={form.category} onChange={(e) => setForm((v) => ({ ...v, category: e.target.value }))} /></Field>
                <Field label="Version"><Input value={form.version} onChange={(e) => setForm((v) => ({ ...v, version: e.target.value }))} /></Field>
              </div>
              <Field label="Status">
                <Select value={form.status} onChange={(e) => setForm((v) => ({ ...v, status: e.target.value }))}>
                  {["Draft", "Review", "Active", "Archived"].map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Summary"><Textarea value={form.summary} onChange={(e) => setForm((v) => ({ ...v, summary: e.target.value }))} /></Field>
              <Field label="Tags (comma separated)"><Input value={form.tags} onChange={(e) => setForm((v) => ({ ...v, tags: e.target.value }))} /></Field>
              <button disabled={saving} className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
                {saving ? "Saving..." : "Create spec"}
              </button>
            </form>
          </Panel>

          <Panel title="Security" subtitle="Production guidance">
            <div className="space-y-2 text-sm leading-6 text-slate-600">
              <p>• Admin access should come from a role in the profiles table.</p>
              <p>• Viewer access should only allow reading published specs.</p>
              <p>• Never trust a hidden route as the primary protection.</p>
              <p>• Never expose the Supabase service role key in the frontend.</p>
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel
            title="Library manager"
            subtitle="Edit and publish existing opspecs"
            actions={
              <Select value={selectedSpecId} onChange={(e) => setSelectedSpecId(e.target.value)}>
                {specs.map((spec) => (
                  <option key={spec.id} value={spec.id}>{`${spec.id} — ${spec.title}`}</option>
                ))}
              </Select>
            }
          >
            {selectedSpec ? (
              <div className="space-y-4">
                <SpecCard spec={selectedSpec} />
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => onPublishToggle(selectedSpec)}
                    disabled={saving}
                    className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {selectedSpec.is_published ? "Unpublish" : "Publish"}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">No specs available yet.</p>
            )}
          </Panel>

          <Panel title="All specs" subtitle="Current database results">
            <div className="grid gap-4">
              {specs.length ? (
                specs.map((spec) => (
                  <div key={spec.id} className="rounded-3xl bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{spec.id} — {spec.title}</p>
                        <p className="mt-1 text-sm text-slate-500">{spec.team || "No team"} • {spec.owner || "No owner"} • {spec.version || "No version"}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {spec.is_published ? <Badge tone="success">Published</Badge> : <Badge>Private</Badge>}
                        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[spec.status] || statusStyles.Draft}`}>{spec.status}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No specs in the database yet.</p>
              )}
            </div>
          </Panel>
        </div>
      </main>
    </div>
  );
}

export default function OpspecsPortal() {
  const [supabase, setSupabase] = useState(null);
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [specs, setSpecs] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("All teams");
  const [selectedStatus, setSelectedStatus] = useState("All statuses");
  const [selectedSpecId, setSelectedSpecId] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    id: "",
    title: "",
    owner: "",
    team: "",
    category: "",
    version: "",
    status: "Draft",
    summary: "",
    tags: "",
  });

  useEffect(() => {
    let mounted = true;
    let unsubscribe = null;

    async function bootstrap() {
      try {
        const module = await import("./lib/supabase");
        const client = module.supabase;
        if (!mounted) return;
        setSupabase(client);

        const { data } = await client.auth.getSession();
        const activeSession = data.session ?? null;
        if (!mounted) return;
        setSession(activeSession);

        if (activeSession?.user) {
          await loadRole(client, activeSession.user.id);
          await loadSpecs(client);
        }

        const listener = client.auth.onAuthStateChange(async (_event, newSession) => {
          if (!mounted) return;
          setSession(newSession ?? null);
          setAuthError("");

          if (newSession?.user) {
            await loadRole(client, newSession.user.id);
            await loadSpecs(client);
          } else {
            setRole(null);
            setSpecs([]);
          }
        });

        unsubscribe = () => listener.data.subscription.unsubscribe();
      } catch (_error) {
        if (mounted) setAuthError("Supabase is not configured yet. Create src/lib/supabase.js and add your environment variables.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    bootstrap();

    return () => {
      mounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, []);

  async function loadRole(client, userId) {
    const { data, error } = await client.from("profiles").select("role").eq("id", userId).single();
    if (!error) setRole(data.role);
    else setRole("viewer");
  }

  async function loadSpecs(client = supabase) {
    if (!client) return;
    const { data, error } = await client.from("specs").select("*").order("updated_at", { ascending: false });
    if (!error) {
      const items = data ?? [];
      setSpecs(items);
      if (items.length && !selectedSpecId) setSelectedSpecId(items[0].id);
    }
  }

  async function handleLogin(email, password) {
    if (!supabase) return;
    setAuthLoading(true);
    setAuthError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(error.message);
    setAuthLoading(false);
  }

  async function handleSignOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setRole(null);
    setSession(null);
    setSpecs([]);
    setSelectedSpecId("");
  }

  async function createSpec() {
    if (!supabase) return;
    setSaving(true);

    const payload = {
      id: form.id,
      title: form.title,
      owner: form.owner,
      team: form.team,
      category: form.category,
      version: form.version,
      status: form.status,
      summary: form.summary,
      tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      is_published: false,
    };

    const { error } = await supabase.from("specs").insert(payload);

    if (!error) {
      setForm({
        id: "",
        title: "",
        owner: "",
        team: "",
        category: "",
        version: "",
        status: "Draft",
        summary: "",
        tags: "",
      });
      await loadSpecs();
    }

    setSaving(false);
  }

  async function togglePublish(spec) {
    if (!supabase) return;
    setSaving(true);
    await supabase
      .from("specs")
      .update({ is_published: !spec.is_published, updated_at: new Date().toISOString() })
      .eq("id", spec.id);
    await loadSpecs();
    setSaving(false);
  }

  if (loading) return <LoadingScreen />;

  if (!session) {
    return <LoginScreen onSubmit={handleLogin} loading={authLoading} error={authError} />;
  }

  if (role === "admin") {
    return (
      <AdminDashboard
        user={session.user}
        specs={specs}
        form={form}
        setForm={setForm}
        selectedSpecId={selectedSpecId}
        setSelectedSpecId={setSelectedSpecId}
        saving={saving}
        onCreate={createSpec}
        onPublishToggle={togglePublish}
        onSignOut={handleSignOut}
      />
    );
  }

  return (
    <ViewerDashboard
      user={session.user}
      specs={specs.filter((spec) => spec.is_published)}
      search={search}
      setSearch={setSearch}
      selectedTeam={selectedTeam}
      setSelectedTeam={setSelectedTeam}
      selectedStatus={selectedStatus}
      setSelectedStatus={setSelectedStatus}
      onSignOut={handleSignOut}
    />
  );
}
