import React, { useState, useEffect } from "react";
import {
  MapPin, Phone, Mail, Clock, Users, Star, Wifi, Car, Wind,
  Umbrella, Truck, ShoppingBag, Accessibility, Baby, PawPrint,
  ChevronLeft, CheckCircle2, XCircle, Building2, Calendar,
  AlertCircle, Loader2, ChevronRight, ImageOff, Badge
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ─── Facility icon map ────────────────────────────────────────────────────────
const FACILITY_ICONS = {
  Parking: { icon: Car, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
  WiFi: { icon: Wifi, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
  AC: { icon: Wind, color: "text-cyan-600", bg: "bg-cyan-50", border: "border-cyan-100" },
  "Outdoor Seating": { icon: Umbrella, color: "text-green-600", bg: "bg-green-50", border: "border-green-100" },
  "Home Delivery": { icon: Truck, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100" },
  Takeaway: { icon: ShoppingBag, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
  "Wheelchair Accessible": { icon: Accessibility, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
  "Kids Play Area": { icon: Baby, color: "text-pink-600", bg: "bg-pink-50", border: "border-pink-100" },
  "Pet Friendly": { icon: PawPrint, color: "text-lime-600", bg: "bg-lime-50", border: "border-lime-100" },
};

// ─── Day order for sorting ────────────────────────────────────────────────────
const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  Active: { color: "text-green-700", bg: "bg-green-100", dot: "bg-green-500" },
  Inactive: { color: "text-gray-600", bg: "bg-gray-100", dot: "bg-gray-400" },
  "Under Maintenance": { color: "text-yellow-700", bg: "bg-yellow-100", dot: "bg-yellow-500" },
  "Temporarily Closed": { color: "text-red-700", bg: "bg-red-100", dot: "bg-red-500" },
};

// ─── Format time "09:00" → "9:00 AM" ─────────────────────────────────────────
const fmt12 = (t) => {
  if (!t) return "—";
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
};

// ─── Get today's day name ─────────────────────────────────────────────────────
const todayName = () => ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][new Date().getDay()];

// ─── Sub-components ───────────────────────────────────────────────────────────
const InfoRow = ({ icon: Icon, label, value, sub }) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
    <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
      <Icon className="w-4 h-4 text-orange-500" />
    </div>
    <div>
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-sm font-semibold text-gray-800 mt-0.5">{value || "—"}</p>
      {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
    </div>
  </div>
);

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ title, icon: Icon }) => (
  <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50">
    <Icon className="w-4 h-4 text-orange-500" />
    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest">{title}</h3>
  </div>
);

// ─── Loading skeleton ─────────────────────────────────────────────────────────
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />
);

const LoadingSkeleton = () => (
  <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
    <Skeleton className="h-72 w-full rounded-2xl" />
    <div className="grid md:grid-cols-3 gap-6">
      <Skeleton className="h-48" />
      <Skeleton className="h-48" />
      <Skeleton className="h-48" />
    </div>
    <Skeleton className="h-64" />
  </div>
);

// ─── Image gallery ────────────────────────────────────────────────────────────
const Gallery = ({ pictures, name }) => {
  const [active, setActive] = useState(0);

  if (!pictures?.length) {
    return (
      <div className="w-full h-72 md:h-96 rounded-2xl bg-gradient-to-br from-orange-100 to-red-50 flex flex-col items-center justify-center border border-orange-100">
        <ImageOff className="w-12 h-12 text-orange-200 mb-3" />
        <p className="text-sm text-gray-400">No photos available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative w-full h-72 md:h-[420px] rounded-2xl overflow-hidden bg-gray-100 group">
        <img
          src={pictures[active]}
          alt={`${name} — photo ${active + 1}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { e.target.src = ""; e.target.style.display = "none"; }}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
        {/* Image counter */}
        <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
          {active + 1} / {pictures.length}
        </div>
        {/* Nav arrows */}
        {pictures.length > 1 && (
          <>
            <button
              onClick={() => setActive((p) => (p - 1 + pictures.length) % pictures.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white backdrop-blur-sm flex items-center justify-center shadow transition opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={() => setActive((p) => (p + 1) % pictures.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white backdrop-blur-sm flex items-center justify-center shadow transition opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </>
        )}
      </div>
      {/* Thumbnails */}
      {pictures.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {pictures.map((url, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition ${active === i ? "border-orange-500 shadow-md" : "border-transparent opacity-60 hover:opacity-100"
                }`}
            >
              <img src={url} alt={`thumb ${i}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function BranchDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [branch, setBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${API_BASE}/api/customer/branch/${id}`, {
      // headers: { Authorization: `Bearer ${sessionStorage.getItem("token") || ""}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load branch (${res.status})`);
        return res.json();
      })
      .then((data) => {
        setBranch(data.data || data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) return <LoadingSkeleton />;

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error) return (
    <div className="max-w-6xl mx-auto px-4 py-16 text-center">
      <div className="inline-flex flex-col items-center gap-4 bg-red-50 border border-red-100 rounded-2xl p-10">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <div>
          <p className="font-semibold text-gray-800">Failed to load branch</p>
          <p className="text-sm text-gray-500 mt-1">{error}</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 bg-white border border-gray-200 text-gray-700 text-sm rounded-xl hover:bg-gray-50 transition"
        >
          Go Back
        </button>
      </div>
    </div>
  );

  if (!branch) return null;

  const statusCfg = STATUS_CONFIG[branch.status] || STATUS_CONFIG.Active;
  const today = todayName();

  // Sort operating hours by day
  const sortedHours = [...(branch.operatingHours || [])].sort(
    (a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day)
  );

  const todayHours = sortedHours.find((h) => h.day === today);
  const isOpenToday = todayHours && !todayHours.isClosed;

  return (

    <><section
      id="home"
      className="relative max-w-7xl mx-auto text-white py-40 overflow-hidden min-h-[350px]"
      style={{
        backgroundImage: `linear-gradient(rgba(15,23,43,.9),rgba(15,23,43,.9)), url('/hero-bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="container mx-auto px-4 text-center  gap-10">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center leading-tight">
          {branch.name}
        </h1>
      </div>
    </section>
      <div className="min-h-screen bg-gradient-to-br from-orange-50/60 to-red-50/40 py-8 px-4">
        <div className="max-w-6xl mx-auto">



          {/* ── Back + breadcrumb ── */}
          <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Branches
            </button>
            <ChevronRight className="w-3 h-3 text-gray-300" />
            <span className="text-gray-900 font-semibold truncate">{branch.name}</span>
          </div>

          {/* ── Page Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-bold text-gray-900">{branch.name}</h1>
                {branch.isMainBranch && (
                  <span className="flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full border border-amber-200">
                    ⭐ Main Branch
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                {/* Status badge */}
                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusCfg.bg} ${statusCfg.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                  {branch.status}
                </span>
                {/* Branch code */}
                <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-mono font-semibold rounded-full">
                  #{branch.code}
                </span>
                {/* Today open/closed */}
                {todayHours && (
                  <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${isOpenToday ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                    }`}>
                    {isOpenToday
                      ? <><CheckCircle2 className="w-3 h-3" /> Open Today {fmt12(todayHours.open)} – {fmt12(todayHours.close)}</>
                      : <><XCircle className="w-3 h-3" /> Closed Today</>}
                  </span>
                )}
              </div>
            </div>

            {/* Edit button */}
            {/* <button
              onClick={() => navigate(`/branches/edit/${id}`)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700 transition flex-shrink-0"
            >
              Edit Branch
            </button> */}
          </div>

          {/* ── Gallery ── */}
          <div className="mb-6">
            <Gallery pictures={branch.pictures} name={branch.name} />
          </div>

          {/* Description */}
          {branch.description && (
            <p className="text-gray-600 text-sm leading-relaxed mb-6 px-1">{branch.description}</p>
          )}

          {/* ── Main grid ── */}
          <div className="grid md:grid-cols-3 gap-5 mb-5">

            {/* Contact */}
            <Card>
              <CardHeader title="Contact" icon={Phone} />
              <div className="px-5 py-2">
                <InfoRow icon={Phone} label="Phone" value={branch.contact?.phone} sub={branch.contact?.alternatePhone ? `Alt: ${branch.contact.alternatePhone}` : null} />
                <InfoRow icon={Mail} label="Email" value={branch.contact?.email} />
              </div>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader title="Location" icon={MapPin} />
              <div className="px-5 py-2">
                <InfoRow
                  icon={MapPin}
                  label="Address"
                  value={[branch.address?.street, branch.address?.city].filter(Boolean).join(", ")}
                  sub={[branch.address?.state, branch.address?.country, branch.address?.zipCode].filter(Boolean).join(" · ")}
                />
                {branch.address?.landmark && (
                  <InfoRow icon={MapPin} label="Landmark" value={branch.address.landmark} />
                )}
              </div>
            </Card>

            {/* Manager */}
            <Card>
              <CardHeader title="Manager" icon={Users} />
              <div className="px-5 py-2">
                <InfoRow icon={Users} label="Name" value={branch.manager?.name} />
                <InfoRow icon={Phone} label="Phone" value={branch.manager?.phone} />
                <InfoRow icon={Mail} label="Email" value={branch.manager?.email} />
              </div>
            </Card>
          </div>

          {/* ── Second row ── */}
          <div className="grid md:grid-cols-2 gap-5 mb-5">

            {/* Operating Hours */}
            <Card>
              <CardHeader title="Operating Hours" icon={Clock} />
              <div className="px-5 py-4">
                {sortedHours.length === 0 ? (
                  <p className="text-sm text-gray-400 py-2">No hours configured</p>
                ) : (
                  <div className="space-y-1.5">
                    {sortedHours.map((h) => {
                      const isToday = h.day === today;
                      return (
                        <div
                          key={h.day}
                          className={`flex items-center justify-between py-2 px-3 rounded-xl text-sm transition ${isToday
                            ? "bg-orange-50 border border-orange-100 font-semibold"
                            : "hover:bg-gray-50"
                            }`}
                        >
                          <div className="flex items-center gap-2">
                            {isToday && <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />}
                            <span className={isToday ? "text-orange-700" : "text-gray-700"}>{h.day}</span>
                          </div>
                          {h.isClosed ? (
                            <span className="text-xs text-red-500 font-semibold">Closed</span>
                          ) : (
                            <span className={isToday ? "text-orange-600" : "text-gray-500"}>
                              {fmt12(h.open)} – {fmt12(h.close)}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </Card>

            {/* Facilities + Capacity */}
            <div className="space-y-5">

              {/* Facilities */}
              <Card>
                <CardHeader title="Facilities" icon={Star} />
                <div className="px-5 py-4">
                  {!branch.facilities?.length ? (
                    <p className="text-sm text-gray-400">No facilities listed</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {branch.facilities.map((f) => {
                        const cfg = FACILITY_ICONS[f] || { icon: CheckCircle2, color: "text-gray-600", bg: "bg-gray-50", border: "border-gray-100" };
                        const Icon = cfg.icon;
                        return (
                          <div
                            key={f}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${cfg.bg} ${cfg.border}`}
                          >
                            <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${cfg.color}`} />
                            <span className={`text-xs font-medium ${cfg.color}`}>{f}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </Card>

              {/* Capacity */}
              <Card>
                <CardHeader title="Capacity" icon={Users} />
                <div className="px-5 py-4 grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-orange-50 border border-orange-100 rounded-2xl">
                    <p className="text-3xl font-bold text-orange-600">{branch.capacity?.seating ?? "—"}</p>
                    <p className="text-xs text-gray-500 mt-1 font-medium">Seating</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                    <p className="text-3xl font-bold text-blue-600">{branch.capacity?.staff ?? "—"}</p>
                    <p className="text-xs text-gray-500 mt-1 font-medium">Staff</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* ── Rating footer ── */}
          {/* {branch.rating && (
            <Card className="px-6 py-4 flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span className="text-2xl font-bold text-gray-900">
                  {branch.rating.average?.toFixed(1) ?? "0.0"}
                </span>
                <span className="text-sm text-gray-400">/ 5.0</span>
              </div>
              <div className="text-sm text-gray-500">
                Based on <span className="font-semibold text-gray-700">{branch.rating.totalReviews ?? 0}</span> review{branch.rating.totalReviews !== 1 ? "s" : ""}
              </div>
              {branch.createdAt && (
                <div className="ml-auto flex items-center gap-1.5 text-xs text-gray-400">
                  <Calendar className="w-3.5 h-3.5" />
                  Added {new Date(branch.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </div>
              )}
            </Card>
          )} */}

        </div>
      </div>
    </>

  );
}