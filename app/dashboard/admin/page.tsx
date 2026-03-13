import { useState, useRef, useEffect, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line, AreaChart, Area,
  RadialBarChart, RadialBar, PieChart, Pie, Cell
} from "recharts";

/* ─── PALETTE ─────────────────────────────────────────────── */
const M = "#7A1F1F", MD = "#5C1717", MB = "#F5EDE3", MC = "#FBF7F0";
const GREEN = "#2E7D32", RED = "#C62828", BLUE = "#1565C0", ORANGE = "#E65100", PURPLE = "#6A1B9A", TEAL = "#00695C";

/* ─── REUSABLE CARD ───────────────────────────────────────── */
function Card({ title, subtitle, right, children, accent, noPad, style = {} }) {
  return (
    <div style={{ background: MC, borderRadius: 16, border: `1px solid ${accent || M}14`, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", overflow: "hidden", ...style }}>
      {(title || right) && (
        <div style={{ padding: "14px 18px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: accent || M, textTransform: "uppercase", letterSpacing: "1.5px" }}>{title}</div>
            {subtitle && <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>{subtitle}</div>}
          </div>
          {right}
        </div>
      )}
      <div style={{ padding: noPad ? 0 : "14px 18px" }}>{children}</div>
    </div>
  );
}

/* ─── ANIMATED NUMBER ─────────────────────────────────────── */
function AnimNum({ to, prefix = "", suffix = "", color = M, size = 28, duration = 1000 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(ease * to));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [to]);
  return <span style={{ fontSize: size, fontWeight: 900, color, fontFamily: "Georgia,serif" }}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

/* ─── CUSTOM TOOLTIP ──────────────────────────────────────── */
const CTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", borderRadius: 10, padding: "10px 14px", boxShadow: "0 4px 20px rgba(0,0,0,0.12)", border: "1px solid #f0e8df", fontSize: 12 }}>
      <div style={{ fontWeight: 700, color: M, marginBottom: 6 }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ display: "flex", gap: 7, alignItems: "center", marginBottom: 3 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: p.color || p.fill }} />
          <span style={{ color: "#666" }}>{p.name}:</span>
          <span style={{ fontWeight: 700 }}>{typeof p.value === "number" && p.value > 999 ? `₹${(p.value / 100000).toFixed(1)}L` : p.value}</span>
        </div>
      ))}
    </div>
  );
};

function ChairmanDashboard({ setTab }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const revenueData = [
    { month: "Oct", collected: 1820000, target: 2000000 },
    { month: "Nov", collected: 2100000, target: 2000000 },
    { month: "Dec", collected: 1650000, target: 2000000 },
    { month: "Jan", collected: 2300000, target: 2000000 },
    { month: "Feb", collected: 1980000, target: 2000000 },
    { month: "Mar", collected: 850000, target: 2000000 },
  ];

  const weekCashFlow = [
    { day: "Mon", inflow: 340000, outflow: 120000 },
    { day: "Tue", inflow: 210000, outflow: 85000 },
    { day: "Wed", inflow: 480000, outflow: 140000 },
    { day: "Thu", inflow: 320000, outflow: 95000 },
    { day: "Fri", inflow: 155000, outflow: 60000 },
  ];

  const classMarks = [
    { cls: "Nursery", maths: 82, science: 88, english: 91, hindi: 85 },
    { cls: "LKG",     maths: 79, science: 83, english: 87, hindi: 81 },
    { cls: "UKG",     maths: 85, science: 80, english: 89, hindi: 83 },
    { cls: "Class 1", maths: 72, science: 76, english: 81, hindi: 78 },
    { cls: "Class 2", maths: 68, science: 74, english: 79, hindi: 75 },
    { cls: "Class 3", maths: 65, science: 70, english: 77, hindi: 72 },
    { cls: "Class 4", maths: 71, science: 68, english: 80, hindi: 74 },
    { cls: "Class 5", maths: 74, science: 72, english: 82, hindi: 76 },
  ];

  const passFailData = [
    { cls: "Class 1", pass: 48, fail: 4 },
    { cls: "Class 2", pass: 50, fail: 5 },
    { cls: "Class 3", pass: 52, fail: 6 },
    { cls: "Class 4", pass: 46, fail: 4 },
    { cls: "Class 5", pass: 44, fail: 4 },
  ];

  const admissionYoY = [
    { year: "2021-22", enrolled: 298 },
    { year: "2022-23", enrolled: 331 },
    { year: "2023-24", enrolled: 358 },
    { year: "2024-25", enrolled: 393 },
  ];

  const feeByClass = [
    { cls: "Nursery",  total: 380000,  collected: 342000 },
    { cls: "LKG",      total: 440000,  collected: 396000 },
    { cls: "UKG",      total: 460000,  collected: 391000 },
    { cls: "Class 1",  total: 780000,  collected: 624000 },
    { cls: "Class 2",  total: 825000,  collected: 693000 },
    { cls: "Class 3",  total: 870000,  collected: 696000 },
    { cls: "Class 4",  total: 750000,  collected: 637500 },
    { cls: "Class 5",  total: 720000,  collected: 504000 },
  ].map(r => ({ ...r, pending: r.total - r.collected, pct: Math.round(r.collected / r.total * 100) }));

  const seatsData = [
    { cls: "Nursery", enrolled: 38, max: 40 },
    { cls: "LKG",     enrolled: 44, max: 45 },
    { cls: "UKG",     enrolled: 46, max: 45 },
    { cls: "Class 1", enrolled: 52, max: 60 },
    { cls: "Class 2", enrolled: 55, max: 60 },
    { cls: "Class 3", enrolled: 58, max: 60 },
    { cls: "Class 4", enrolled: 50, max: 60 },
    { cls: "Class 5", enrolled: 50, max: 60 },
  ];

  const staffData = [
    { dept: "Teaching", total: 28, present: 25, color: GREEN },
    { dept: "Admin", total: 8, present: 8, color: BLUE },
    { dept: "Support", total: 12, present: 10, color: ORANGE },
  ];

  const topDefaulters = [
    { name: "Vivaan Mehta", cls: "Class 3", amt: 19000 },
    { name: "Aarav Sharma", cls: "Class 3", amt: 18500 },
    { name: "Kabir Singh", cls: "Class 1", amt: 17400 },
    { name: "Diya Verma", cls: "Class 2", amt: 15200 },
    { name: "Anaya Gupta", cls: "Nursery", amt: 13200 },
  ];

  const events = [
    { date: "Mar 12", label: "Holi Holiday", type: "holiday" },
    { date: "Mar 14", label: "Parent-Teacher Meeting", type: "event" },
    { date: "Mar 20", label: "Annual Sports Day", type: "event" },
    { date: "Apr 7",  label: "Term 3 Exams Begin", type: "exam" },
    { date: "Apr 18", label: "Summer Break Starts", type: "holiday" },
  ];

  const evtColors = { holiday: ORANGE, event: BLUE, exam: M };

  const totalStaff = staffData.reduce((a, d) => a + d.total, 0);
  const presentStaff = staffData.reduce((a, d) => a + d.present, 0);
  const absentStaff = totalStaff - presentStaff;
  const totalStudents = 393, presentStudents = 359, absentStudents = totalStudents - presentStudents;
  const totalFeeExp = 12000000, totalFeeCol = 8700000;
  const feePct = Math.round(totalFeeCol / totalFeeExp * 100);
  const thisWeekInflow = weekCashFlow.reduce((a, d) => a + d.inflow, 0);
  const lastWeekInflow = 1650000;
  const weekDelta = Math.round((thisWeekInflow - lastWeekInflow) / lastWeekInflow * 100);

  const briefings = [
    { icon: absentStudents > 40 ? "🔴" : "🟡", text: `${absentStudents} students absent today — ${absentStudents > 40 ? "highest this month" : "within normal range"}`, urgent: absentStudents > 40 },
    { icon: weekDelta >= 0 ? "🟢" : "🔴", text: `Fee inflow ₹${(thisWeekInflow / 100000).toFixed(1)}L this week — ${weekDelta >= 0 ? "▲" : "▼"}${Math.abs(weekDelta)}% vs last week`, urgent: weekDelta < -10 },
    { icon: "🟡", text: `${absentStaff} staff absent today — ${staffData.find(d => d.total - d.present > 0)?.dept || "Teaching"} dept affected`, urgent: absentStaff > 4 },
    { icon: "🟢", text: `${admissionYoY[3].enrolled - admissionYoY[2].enrolled} more students enrolled vs last year (+${Math.round((admissionYoY[3].enrolled - admissionYoY[2].enrolled) / admissionYoY[2].enrolled * 100)}% growth)`, urgent: false },
    { icon: "🟡", text: `UKG is over capacity (${seatsData[2].enrolled}/${seatsData[2].max}) — consider creating new section`, urgent: true },
  ];

  const heatColor = v => v >= 85 ? "#1B5E20" : v >= 75 ? "#388E3C" : v >= 65 ? "#FFA000" : "#C62828";

  return (
    <div style={{ paddingBottom: 40 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "Georgia,serif", color: M, fontSize: 22, fontWeight: 800 }}>Chairman's Dashboard</div>
        <div style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>{dateStr}</div>
      </div>

      <div style={{ background: `linear-gradient(135deg, ${MD} 0%, ${M} 60%, #A03030 100%)`, borderRadius: 16, padding: "16px 20px", marginBottom: 20, boxShadow: `0 8px 32px ${M}44` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 18 }}>📋</span>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 13, letterSpacing: 1 }}>MORNING BRIEFING</span>
          <span style={{ marginLeft: "auto", fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Auto-generated from live data</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {briefings.map((b, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 12px", borderRadius: 8, background: b.urgent ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)" }}>
              <span style={{ fontSize: 14, flexShrink: 0 }}>{b.icon}</span>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.9)", lineHeight: 1.4 }}>{b.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total Students", val: totalStudents, icon: "🎓", color: M, sub: "Across 8 classes" },
          { label: "Present Today", val: presentStudents, icon: "✅", color: GREEN, sub: `${Math.round(presentStudents / totalStudents * 100)}% attendance` },
          { label: "Fee Collected", val: feePct, icon: "💰", color: BLUE, suffix: "%", sub: "₹87L of ₹120L" },
          { label: "Staff Present", val: presentStaff, icon: "👩‍🏫", color: TEAL, sub: `${absentStaff} absent today` },
          { label: "This Week Inflow", val: Math.round(thisWeekInflow / 1000), icon: "📈", color: ORANGE, prefix: "₹", suffix: "K", sub: `${weekDelta >= 0 ? "▲" : "▼"}${Math.abs(weekDelta)}% vs last week` },
        ].map(k => (
          <div key={k.label} style={{ background: MC, borderRadius: 14, padding: "16px 14px", border: `1px solid ${k.color}20`, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -10, right: -10, fontSize: 44, opacity: 0.07 }}>{k.icon}</div>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{k.icon}</div>
            <AnimNum to={k.val} prefix={k.prefix || ""} suffix={k.suffix || ""} color={k.color} size={24} />
            <div style={{ fontSize: 10, fontWeight: 700, color: k.color, textTransform: "uppercase", letterSpacing: 1, marginTop: 4 }}>{k.label}</div>
            <div style={{ fontSize: 10, color: "#aaa", marginTop: 2 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>
        <Card title="Monthly Revenue — Collected vs Target" subtitle="Last 6 months · ₹ in Lakhs">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={M} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={M} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0e8df" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#aaa" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => `₹${v / 100000}L`} tick={{ fontSize: 10, fill: "#ccc" }} axisLine={false} tickLine={false} width={44} />
              <Tooltip content={<CTip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="target" name="Target" stroke="#ddd" strokeWidth={2} strokeDasharray="6 3" dot={false} />
              <Area type="monotone" dataKey="collected" name="Collected" stroke={M} strokeWidth={2.5} fill="url(#colGrad)" dot={{ r: 4, fill: M }} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Top Pending Fees" subtitle="Ranked by amount" accent={RED}>
          {topDefaulters.map((d, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: i < topDefaulters.length - 1 ? "1px solid #f5ede3" : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 20, height: 20, borderRadius: "50%", background: `${M}15`, display: "grid", placeItems: "center", fontSize: 9, fontWeight: 800, color: M }}>{i + 1}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#333" }}>{d.name}</div>
                  <div style={{ fontSize: 10, color: "#aaa" }}>{d.cls}</div>
                </div>
              </div>
              <span style={{ fontSize: 12, fontWeight: 800, color: RED }}>₹{d.amt.toLocaleString()}</span>
            </div>
          ))}
        </Card>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Card title="This Week's Cash Flow" subtitle="Daily inflow vs outflow">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={weekCashFlow} barCategoryGap="30%" barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0e8df" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#aaa" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => `₹${v / 1000}K`} tick={{ fontSize: 10, fill: "#ccc" }} axisLine={false} tickLine={false} width={48} />
              <Tooltip content={<CTip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="inflow" name="Inflow" fill={GREEN} radius={[4, 4, 0, 0]} />
              <Bar dataKey="outflow" name="Outflow" fill={RED} opacity={0.7} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <Card title="Subject-wise Average Marks" subtitle="Term 3 · All classes · Hover for value">
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "3px", fontSize: 11 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", color: "#aaa", fontWeight: 600, padding: "0 6px 6px 0", fontSize: 10 }}>Class</th>
                  {["Maths", "Science", "English", "Hindi"].map(s => (
                    <th key={s} style={{ color: "#aaa", fontWeight: 600, padding: "0 0 6px", fontSize: 10, textAlign: "center" }}>{s}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {classMarks.map(row => (
                  <tr key={row.cls}>
                    <td style={{ fontSize: 11, fontWeight: 600, color: M, paddingRight: 8, paddingBottom: 3, whiteSpace: "nowrap" }}>{row.cls}</td>
                    {[row.maths, row.science, row.english, row.hindi].map((v, i) => (
                      <td key={i} title={`${v}%`} style={{ textAlign: "center", paddingBottom: 3 }}>
                        <div style={{ width: "100%", padding: "5px 4px", borderRadius: 6, background: heatColor(v), color: "#fff", fontWeight: 700, fontSize: 11 }}>{v}</div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ display: "flex", gap: 12, marginTop: 10, flexWrap: "wrap" }}>
              {[["≥85 Excellent", "#1B5E20"], ["75–84 Good", "#388E3C"], ["65–74 Average", "#FFA000"], ["<65 Needs Help", "#C62828"]].map(([l, c]) => (
                <div key={l} style={{ display: "flex", gap: 5, alignItems: "center", fontSize: 10, color: "#666" }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: c }} />{l}
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card title="Pass / Fail Ratio" subtitle="Term 3 exams · Classes 1–5" accent={GREEN}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={passFailData} layout="vertical" barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f0eb" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: "#ccc" }} axisLine={false} tickLine={false} />
              <YAxis dataKey="cls" type="category" tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} width={52} />
              <Tooltip content={<CTip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="pass" name="Pass" fill={GREEN} stackId="a" radius={[0, 4, 4, 0]} />
              <Bar dataKey="fail" name="Fail" fill={RED} stackId="a" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16, marginBottom: 16 }}>
        <Card title="Staff Today" subtitle="Presence by department" accent={TEAL}>
          {staffData.map(d => {
            const pct = Math.round(d.present / d.total * 100);
            return (
              <div key={d.dept} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                  <span style={{ fontWeight: 600, color: "#333" }}>{d.dept}</span>
                  <span style={{ fontWeight: 700, color: d.color }}>{d.present}/{d.total}</span>
                </div>
                <div style={{ background: "#eee", borderRadius: 6, height: 8 }}>
                  <div style={{ width: `${pct}%`, height: "100%", borderRadius: 6, background: d.color, transition: "width 1s ease" }} />
                </div>
                {d.total - d.present > 0 && (
                  <div style={{ fontSize: 10, color: RED, marginTop: 3 }}>⚠ {d.total - d.present} absent</div>
                )}
              </div>
            );
          })}
          <div style={{ marginTop: 10, padding: "10px 12px", borderRadius: 10, background: `${TEAL}10`, border: `1px solid ${TEAL}25` }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: TEAL, fontFamily: "Georgia,serif" }}>{presentStaff}<span style={{ fontSize: 13, fontWeight: 500 }}>/{totalStaff}</span></div>
            <div style={{ fontSize: 10, color: "#888", marginTop: 2 }}>Total Staff Present</div>
          </div>
        </Card>

        <Card title="Class Utilization — Enrolled vs Capacity" subtitle="Seat availability across all sections" accent={BLUE}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {seatsData.map(d => {
              const pct = Math.round(d.enrolled / d.max * 100);
              const over = d.enrolled > d.max;
              const color = over ? RED : pct >= 90 ? ORANGE : BLUE;
              return (
                <div key={d.cls} style={{ background: over ? "#FFEBEE" : "#F8F4FF", borderRadius: 10, padding: "10px 8px", textAlign: "center", border: `1px solid ${color}25` }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color, marginBottom: 6 }}>{d.cls}</div>
                  <svg width="54" height="54" viewBox="0 0 54 54" style={{ display: "block", margin: "0 auto 4px" }}>
                    <circle cx="27" cy="27" r="22" fill="none" stroke="#eee" strokeWidth={7} />
                    <circle cx="27" cy="27" r="22" fill="none" stroke={color} strokeWidth={7}
                      strokeDasharray={`${Math.min(pct, 100) / 100 * 138.2} 138.2`}
                      strokeLinecap="round"
                      transform="rotate(-90 27 27)" />
                    <text x="27" y="31" textAnchor="middle" fontSize="11" fontWeight="800" fill={color}>{pct}%</text>
                  </svg>
                  <div style={{ fontSize: 10, color: "#888" }}>{d.enrolled}/{d.max}</div>
                  {over && <div style={{ fontSize: 9, color: RED, fontWeight: 700, marginTop: 2 }}>OVER CAPACITY</div>}
                  {!over && d.max - d.enrolled <= 3 && <div style={{ fontSize: 9, color: ORANGE, fontWeight: 700, marginTop: 2 }}>{d.max - d.enrolled} seat{d.max - d.enrolled !== 1 ? "s" : ""} left</div>}
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <Card title="Year-on-Year Admissions" subtitle="Enrollment growth trend" accent={PURPLE}>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={admissionYoY} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0e8df" vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#aaa" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#ccc" }} axisLine={false} tickLine={false} width={30} domain={[250, 420]} />
              <Tooltip content={<CTip />} />
              <Bar dataKey="enrolled" name="Enrolled" radius={[6, 6, 0, 0]}>
                {admissionYoY.map((_, i) => (
                  <Cell key={i} fill={i === admissionYoY.length - 1 ? M : `${M}55`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <div style={{ flex: 1, padding: "10px 12px", borderRadius: 10, background: `${GREEN}10`, border: `1px solid ${GREEN}25`, textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: GREEN }}>+9.8%</div>
              <div style={{ fontSize: 10, color: "#aaa" }}>Growth this year</div>
            </div>
            <div style={{ flex: 1, padding: "10px 12px", borderRadius: 10, background: `${M}10`, border: `1px solid ${M}25`, textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: M }}>393</div>
              <div style={{ fontSize: 10, color: "#aaa" }}>Total enrolled</div>
            </div>
          </div>
        </Card>

        <Card title="Fee Collection by Class" subtitle="Term 3 · Collected vs pending" accent={GREEN}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 2 }}>
            {feeByClass.map(r => (
              <div key={r.cls} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 52, fontSize: 10, fontWeight: 600, color: M, flexShrink: 0 }}>{r.cls}</div>
                <div style={{ flex: 1, background: "#f0e8df", borderRadius: 5, height: 20, overflow: "hidden", position: "relative" }}>
                  <div style={{ width: `${r.pct}%`, height: "100%", background: r.pct >= 90 ? GREEN : r.pct >= 75 ? TEAL : ORANGE, borderRadius: 5, transition: "width 1s ease" }} />
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, color: r.pct >= 90 ? GREEN : r.pct >= 75 ? TEAL : ORANGE, width: 30, textAlign: "right" }}>{r.pct}%</div>
                <div style={{ fontSize: 10, color: RED, fontWeight: 600, width: 44, textAlign: "right" }}>₹{(r.pending/1000).toFixed(0)}K</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <div style={{ flex: 1, padding: "9px 10px", borderRadius: 10, background: `${GREEN}10`, border: `1px solid ${GREEN}25`, textAlign: "center" }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: GREEN }}>₹{(feeByClass.reduce((a,r)=>a+r.collected,0)/100000).toFixed(1)}L</div>
              <div style={{ fontSize: 9, color: "#aaa", marginTop: 1 }}>Collected</div>
            </div>
            <div style={{ flex: 1, padding: "9px 10px", borderRadius: 10, background: `${RED}08`, border: `1px solid ${RED}20`, textAlign: "center" }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: RED }}>₹{(feeByClass.reduce((a,r)=>a+r.pending,0)/100000).toFixed(1)}L</div>
              <div style={{ fontSize: 9, color: "#aaa", marginTop: 1 }}>Pending</div>
            </div>
            <div style={{ flex: 1, padding: "9px 10px", borderRadius: 10, background: `${M}08`, border: `1px solid ${M}20`, textAlign: "center" }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: M }}>{Math.round(feeByClass.reduce((a,r)=>a+r.collected,0)/feeByClass.reduce((a,r)=>a+r.total,0)*100)}%</div>
              <div style={{ fontSize: 9, color: "#aaa", marginTop: 1 }}>Overall</div>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card title="Upcoming Events & Holidays" subtitle="Next 60 days" accent={BLUE}>
          {events.map((e, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: i < events.length - 1 ? "1px solid #f5ede3" : "none" }}>
              <div style={{ textAlign: "center", minWidth: 44, padding: "4px 6px", borderRadius: 8, background: `${evtColors[e.type]}15`, border: `1px solid ${evtColors[e.type]}30` }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: evtColors[e.type], lineHeight: 1 }}>{e.date.split(" ")[0].toUpperCase()}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: evtColors[e.type] }}>{e.date.split(" ")[1]}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#333" }}>{e.label}</div>
                <div style={{ fontSize: 10, color: evtColors[e.type], fontWeight: 600, textTransform: "capitalize" }}>{e.type}</div>
              </div>
            </div>
          ))}
        </Card>

        <Card title="School Attendance — 5-Day Trend" subtitle="Today vs previous 4 days" accent={GREEN}>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={[
              { day: "Mon", students: 331, staff: 44 },
              { day: "Tue", students: 344, staff: 46 },
              { day: "Wed", students: 339, staff: 45 },
              { day: "Thu", students: 348, staff: 46 },
              { day: "Today", students: presentStudents, staff: presentStaff },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0e8df" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#aaa" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#ccc" }} axisLine={false} tickLine={false} width={30} />
              <Tooltip content={<CTip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="students" name="Students" stroke={GREEN} strokeWidth={2.5} dot={{ r: 4, fill: GREEN }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="staff" name="Staff" stroke={TEAL} strokeWidth={2} strokeDasharray="5 3" dot={{ r: 3, fill: TEAL }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

const CLASS_DATA = [
  { cls: "Nursery", total: 40, today: 36, yesterday: 33 },
  { cls: "LKG",     total: 44, today: 40, yesterday: 42 },
  { cls: "UKG",     total: 46, today: 43, yesterday: 41 },
  { cls: "Class 1", total: 52, today: 48, yesterday: 50 },
  { cls: "Class 2", total: 55, today: 49, yesterday: 52 },
  { cls: "Class 3", total: 58, today: 53, yesterday: 51 },
  { cls: "Class 4", total: 50, today: 46, yesterday: 47 },
  { cls: "Class 5", total: 48, today: 44, yesterday: 45 },
];
const TOTAL_STUDENTS = CLASS_DATA.reduce((a, c) => a + c.total, 0);
const PRESENT_TODAY  = CLASS_DATA.reduce((a, c) => a + c.today, 0);
const PRESENT_YEST   = CLASS_DATA.reduce((a, c) => a + c.yesterday, 0);
const ABSENT_TODAY   = TOTAL_STUDENTS - PRESENT_TODAY;
const ABSENT_YEST    = TOTAL_STUDENTS - PRESENT_YEST;

function Donut({ present, total, size = 90 }) {
  const r = 34, cx = size / 2, cy = size / 2, circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#EDE0D5" strokeWidth={10} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={M} strokeWidth={10}
        strokeDasharray={`${present / total * circ} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`} style={{ transition: "stroke-dasharray 1.2s ease" }} />
      <text x={cx} y={cy + 5} textAnchor="middle" fontSize={15} fontWeight={800} fill={M}>{Math.round(present / total * 100)}%</text>
    </svg>
  );
}

function StudentOverview() {
  const [view, setView] = useState("bar");
  const trend = [
    { day: "Mon", present: 331, absent: TOTAL_STUDENTS - 331 },
    { day: "Tue", present: 344, absent: TOTAL_STUDENTS - 344 },
    { day: "Wed", present: 339, absent: TOTAL_STUDENTS - 339 },
    { day: "Thu", present: PRESENT_YEST, absent: ABSENT_YEST },
    { day: "Today", present: PRESENT_TODAY, absent: ABSENT_TODAY },
  ];
  const delta = PRESENT_TODAY - PRESENT_YEST;
  const deltaAbs = ABSENT_TODAY - ABSENT_YEST;
  return (
    <div>
      <div style={{ fontFamily: "Georgia,serif", color: M, fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Student Overview</div>
      <div style={{ fontSize: 12, color: "#aaa", marginBottom: 18 }}>Live attendance snapshot — today vs yesterday</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 18 }}>
        <div style={{ background: `linear-gradient(135deg,${M},${MD})`, borderRadius: 16, padding: "18px 16px", color: "#fff" }}>
          <div style={{ fontSize: 11, opacity: 0.7, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>Total Admitted</div>
          <AnimNum to={TOTAL_STUDENTS} color="#fff" size={40} />
          <div style={{ fontSize: 11, opacity: 0.7, marginTop: 6 }}>Across {CLASS_DATA.length} classes</div>
        </div>
        <div style={{ background: MC, borderRadius: 16, padding: "18px 16px", border: "1px solid #A5D6A720" }}>
          <div style={{ fontSize: 11, color: GREEN, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>Present Today</div>
          <AnimNum to={PRESENT_TODAY} color={GREEN} size={38} />
          <div style={{ fontSize: 12, color: delta >= 0 ? GREEN : RED, fontWeight: 700, marginTop: 6 }}>{delta >= 0 ? "▲" : "▼"} {Math.abs(delta)} <span style={{ fontWeight: 400, color: "#aaa" }}>vs yesterday</span></div>
        </div>
        <div style={{ background: MC, borderRadius: 16, padding: "18px 16px", border: "1px solid #FFCDD220" }}>
          <div style={{ fontSize: 11, color: RED, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>Absent Today</div>
          <AnimNum to={ABSENT_TODAY} color={RED} size={38} />
          <div style={{ fontSize: 12, color: deltaAbs > 0 ? RED : GREEN, fontWeight: 700, marginTop: 6 }}>{deltaAbs > 0 ? "▲" : "▼"} {Math.abs(deltaAbs)} <span style={{ fontWeight: 400, color: "#aaa" }}>vs yesterday</span></div>
        </div>
        <div style={{ background: MC, borderRadius: 16, padding: "18px 16px", border: `1px solid ${M}15`, display: "flex", alignItems: "center", gap: 14 }}>
          <Donut present={PRESENT_TODAY} total={TOTAL_STUDENTS} />
          <div>
            <div style={{ fontSize: 11, color: M, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Today's Rate</div>
            <div style={{ fontSize: 12, color: "#555", lineHeight: 1.7 }}><span style={{ color: GREEN, fontWeight: 700 }}>{PRESENT_TODAY}</span> present<br /><span style={{ color: RED, fontWeight: 700 }}>{ABSENT_TODAY}</span> absent</div>
          </div>
        </div>
      </div>
      <div style={{ background: MC, borderRadius: 16, padding: "18px 20px", border: `1px solid ${M}12`, marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: M }}>Attendance — Today vs Yesterday</div>
            <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>Class-wise comparison</div>
          </div>
          <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", border: `1.5px solid ${M}25` }}>
            {[["bar","Bar"],["line","Trend"],["table","Table"]].map(([v,l]) => (
              <button key={v} onClick={() => setView(v)} style={{ padding: "5px 13px", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, background: view === v ? M : "transparent", color: view === v ? "#fff" : "#888" }}>{l}</button>
            ))}
          </div>
        </div>
        {view === "bar" && (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={CLASS_DATA} barCategoryGap="28%" barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0e8df" vertical={false} />
              <XAxis dataKey="cls" tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#ccc" }} axisLine={false} tickLine={false} width={28} />
              <Tooltip content={<CTip />} cursor={{ fill: `${M}08` }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="yesterday" name="Yesterday" fill="#C4884A55" radius={[4,4,0,0]} />
              <Bar dataKey="today" name="Today" fill={M} radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
        {view === "line" && (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0e8df" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#ccc" }} axisLine={false} tickLine={false} width={32} domain={[280,400]} />
              <Tooltip content={<CTip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="present" name="Present" stroke={GREEN} strokeWidth={2.5} dot={{ r: 4, fill: GREEN }} />
              <Line type="monotone" dataKey="absent" name="Absent" stroke={RED} strokeWidth={2.5} strokeDasharray="5 3" dot={{ r: 4, fill: RED }} />
            </LineChart>
          </ResponsiveContainer>
        )}
        {view === "table" && (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid #f0e8df` }}>
                {["Class","Total","Present","Absent","Yesterday","Change"].map(h => (
                  <th key={h} style={{ padding: "8px 10px", textAlign: h === "Class" ? "left" : "center", color: M, fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: 1 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CLASS_DATA.map((row, i) => {
                const diff = row.today - row.yesterday;
                return (
                  <tr key={row.cls} style={{ borderBottom: "1px solid #f8f2ec", background: i % 2 === 0 ? "#fff" : "#fdfaf7" }}>
                    <td style={{ padding: "9px 10px", fontWeight: 600, color: M }}>{row.cls}</td>
                    <td style={{ textAlign: "center", fontWeight: 700, color: "#555" }}>{row.total}</td>
                    <td style={{ textAlign: "center" }}><span style={{ color: GREEN, fontWeight: 700 }}>{row.today}</span> <span style={{ color: "#aaa", fontSize: 10 }}>({Math.round(row.today/row.total*100)}%)</span></td>
                    <td style={{ textAlign: "center" }}><span style={{ color: RED, fontWeight: 700 }}>{row.total - row.today}</span></td>
                    <td style={{ textAlign: "center", color: "#888" }}>{row.yesterday}</td>
                    <td style={{ textAlign: "center", fontWeight: 700, color: diff >= 0 ? GREEN : RED }}>{diff >= 0 ? "▲" : "▼"} {Math.abs(diff)}</td>
                  </tr>
                );
              })}
              <tr style={{ borderTop: `2px solid #f0e8df`, background: `${M}08` }}>
                <td style={{ padding: "9px 10px", fontWeight: 800, color: M }}>All Classes</td>
                <td style={{ textAlign: "center", fontWeight: 800, color: M }}>{TOTAL_STUDENTS}</td>
                <td style={{ textAlign: "center", fontWeight: 800, color: GREEN }}>{PRESENT_TODAY}</td>
                <td style={{ textAlign: "center", fontWeight: 800, color: RED }}>{ABSENT_TODAY}</td>
                <td style={{ textAlign: "center", fontWeight: 800, color: "#888" }}>{PRESENT_YEST}</td>
                <td style={{ textAlign: "center", fontWeight: 800, color: delta >= 0 ? GREEN : RED }}>{delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
        {CLASS_DATA.map(c => {
          const pct = Math.round(c.today / c.total * 100);
          const diff = c.today - c.yesterday;
          return (
            <div key={c.cls} style={{ background: MC, borderRadius: 12, padding: "12px 14px", border: `1px solid ${M}12` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 12, color: M }}>{c.cls}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: diff >= 0 ? GREEN : RED }}>{diff >= 0 ? "▲" : "▼"}{Math.abs(diff)}</span>
              </div>
              <div style={{ background: "#eee", borderRadius: 4, height: 6, marginBottom: 7 }}>
                <div style={{ width: `${pct}%`, height: "100%", borderRadius: 4, background: pct >= 90 ? GREEN : pct >= 75 ? M : RED, transition: "width 1s ease" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10 }}>
                <span style={{ color: GREEN, fontWeight: 700 }}>✓ {c.today}</span>
                <span style={{ color: RED, fontWeight: 700 }}>✗ {c.total - c.today}</span>
                <span style={{ color: "#aaa" }}>{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const cardInput = { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e0d6cc", background: MB, fontSize: 13, marginBottom: 10, boxSizing: "border-box" };

function QRCanvas({ value, size = 180 }) {
  const ref = useRef();
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    const mod = 25, cell = Math.floor(size / mod);
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, size, size);
    let seed = [...value].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) | 0, 0);
    const rand = () => { seed = (seed * 1664525 + 1013904223) | 0; return (seed >>> 0) / 4294967296; };
    const grid = Array.from({ length: mod }, (_, r) => Array.from({ length: mod }, (_, c2) => {
      if ((r < 7 && c2 < 7) || (r < 7 && c2 > mod - 8) || (r > mod - 8 && c2 < 7)) return true;
      return rand() > 0.52;
    }));
    const finder = (ox, oy) => {
      ctx.fillStyle = "#222"; ctx.fillRect(ox * cell, oy * cell, 7 * cell, 7 * cell);
      ctx.fillStyle = "#fff"; ctx.fillRect((ox + 1) * cell, (oy + 1) * cell, 5 * cell, 5 * cell);
      ctx.fillStyle = "#222"; ctx.fillRect((ox + 2) * cell, (oy + 2) * cell, 3 * cell, 3 * cell);
    };
    grid.forEach((row, r) => row.forEach((on, c2) => {
      const inF = (r < 8 && c2 < 8) || (r < 8 && c2 > mod - 9) || (r > mod - 9 && c2 < 8);
      if (on && !inF) { ctx.fillStyle = "#1a1a1a"; ctx.fillRect(c2 * cell, r * cell, cell - 1, cell - 1); }
    }));
    finder(0, 0); finder(mod - 7, 0); finder(0, mod - 7);
    ctx.fillStyle = "#fff"; ctx.fillRect(size / 2 - 18, size / 2 - 12, 36, 24);
    ctx.fillStyle = M; ctx.font = `bold ${cell * 1.1}px Georgia`; ctx.textAlign = "center";
    ctx.fillText("UPI", size / 2, size / 2 + 5);
  }, [value, size]);
  return <canvas ref={ref} width={size} height={size} style={{ borderRadius: 8 }} />;
}

function Sheet({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 520, padding: "0 0 28px", boxShadow: "0 -8px 40px rgba(0,0,0,0.18)", animation: "slideUp .25s ease" }}>
        <style>{`@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
        <div style={{ padding: "16px 20px 10px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f0e8df" }}>
          <span style={{ fontWeight: 700, color: M, fontSize: 15 }}>{title}</span>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: "50%", border: "none", background: "#f5f5f5", cursor: "pointer", color: "#888" }}>✕</button>
        </div>
        <div style={{ padding: "16px 20px 0" }}>{children}</div>
      </div>
    </div>
  );
}

const methodBtn = (bg, col) => ({ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 12, border: `1.5px solid ${col}30`, background: bg, cursor: "pointer", width: "100%", textAlign: "left", marginBottom: 10 });

function PaySheet({ open, onClose, amount, term }) {
  const [step, setStep] = useState("choose");
  const reset = () => { setStep("choose"); onClose(); };
  const upiId = "glis.school@upi";
  const upiUrl = `upi://pay?pa=${upiId}&pn=GL+International+School&am=${amount}&cu=INR&tn=Fee+${term}`;
  return (
    <Sheet open={open} onClose={reset} title={`Pay ₹${amount?.toLocaleString()} — ${term}`}>
      {step === "choose" && <div>
        <p style={{ fontSize: 12, color: "#888", marginBottom: 14 }}>Choose a payment method.</p>
        <button onClick={() => setStep("qr")} style={methodBtn("#E8F0FF", BLUE)}><span style={{ fontSize: 22 }}>📷</span><div><div style={{ fontWeight: 700, fontSize: 13 }}>Scan QR Code</div><div style={{ fontSize: 11, color: "#666" }}>Open any UPI app & scan</div></div><span style={{ marginLeft: "auto", fontSize: 18, color: BLUE }}>›</span></button>
        <a href={upiUrl} onClick={() => setTimeout(() => setStep("success"), 1200)} style={{ ...methodBtn("#E8F5E9", GREEN), textDecoration: "none", display: "flex" }}><span style={{ fontSize: 22 }}>⚡</span><div><div style={{ fontWeight: 700, fontSize: 13, color: GREEN }}>Pay via UPI App</div><div style={{ fontSize: 11, color: "#555" }}>GPay, PhonePe, Paytm…</div></div><span style={{ marginLeft: "auto", fontSize: 18, color: GREEN }}>›</span></a>
        <button onClick={() => setStep("card")} style={methodBtn("#FFF3E0", ORANGE)}><span style={{ fontSize: 22 }}>💳</span><div><div style={{ fontWeight: 700, fontSize: 13 }}>Debit / Credit Card</div><div style={{ fontSize: 11, color: "#666" }}>Visa, Mastercard, RuPay</div></div><span style={{ marginLeft: "auto", fontSize: 18, color: ORANGE }}>›</span></button>
      </div>}
      {step === "qr" && <div style={{ textAlign: "center" }}>
        <div style={{ display: "inline-block", padding: 16, borderRadius: 16, background: "#fff", boxShadow: "0 4px 24px rgba(0,0,0,.1)", border: "1.5px solid #eee", marginBottom: 14 }}><QRCanvas value={upiUrl} size={200} /></div>
        <div style={{ fontSize: 13, fontWeight: 600, color: M, marginBottom: 4 }}>Scan with any UPI app</div>
        <div style={{ fontSize: 11, color: "#888", marginBottom: 12 }}>UPI ID: <b style={{ color: "#555" }}>{upiId}</b></div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setStep("choose")} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1.5px solid #ddd", background: "#fff", fontSize: 13, cursor: "pointer", color: "#666" }}>← Back</button>
          <button onClick={() => setStep("success")} style={{ flex: 2, padding: "10px", borderRadius: 10, border: "none", background: M, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>I've Paid ✓</button>
        </div>
      </div>}
      {step === "card" && <div>
        <input placeholder="Card Number" style={cardInput} />
        <div style={{ display: "flex", gap: 10, marginBottom: 10 }}><input placeholder="MM / YY" style={{ ...cardInput, marginBottom: 0, flex: 1 }} /><input placeholder="CVV" style={{ ...cardInput, marginBottom: 0, flex: 1 }} /></div>
        <input placeholder="Cardholder Name" style={cardInput} />
        <button onClick={() => setStep("success")} style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: M, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 4 }}>Pay ₹{amount?.toLocaleString()} →</button>
      </div>}
      {step === "success" && <div style={{ textAlign: "center", padding: "20px 0 8px" }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>✅</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: GREEN, marginBottom: 6 }}>Payment Successful!</div>
        <div style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>₹{amount?.toLocaleString()} paid for {term}</div>
        <button onClick={reset} style={{ padding: "10px 32px", borderRadius: 10, border: "none", background: M, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Done</button>
      </div>}
    </Sheet>
  );
}

const Crest = ({ size = 44 }) => (
  <div style={{ width: size, height: size, background: `linear-gradient(135deg,${M},${MD})`, borderRadius: "50%", display: "grid", placeItems: "center", color: "#fff", fontWeight: 800, fontSize: size * 0.3, fontFamily: "Georgia,serif", letterSpacing: 1, boxShadow: `0 4px 12px ${M}44`, flexShrink: 0 }}>GL</div>
);

function TopBar({ role, subRole }) {
  const [open, setOpen] = useState(false);
  const notifs = ["Fee reminder sent to Aarav Sharma – 10 min ago", "Sara Khan moved to Interview – 1 hr ago", "PTM scheduled March 14 – 2 hrs ago"];
  const portalLabel = role === "admin" ? "Chairman's Portal"
    : role === "administration" ? `Administration · ${subRole === "principal" ? "Principal" : subRole === "accounts" ? "Accounts / Finance" : "Coordinator"}`
    : role === "teacher" ? "Teacher Portal"
    : "Parent Portal";
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 24px", background: MC, boxShadow: `0 2px 12px ${M}14`, borderBottom: `2px solid ${M}22`, position: "sticky", top: 0, zIndex: 50 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Crest />
        <div>
          <div style={{ fontWeight: 700, color: M, fontSize: 15, fontFamily: "Georgia,serif" }}>G.L. International School</div>
          <div style={{ fontSize: 11, color: "#888" }}>{portalLabel}</div>
        </div>
      </div>
      <div style={{ position: "relative" }}>
        <button onClick={() => setOpen(o => !o)} style={{ width: 38, height: 38, borderRadius: "50%", background: `${M}15`, border: `1.5px solid ${M}30`, display: "grid", placeItems: "center", cursor: "pointer", fontSize: 16 }}>🔔</button>
        <span style={{ position: "absolute", top: -2, right: -2, width: 16, height: 16, borderRadius: "50%", background: "#E53935", fontSize: 9, color: "#fff", display: "grid", placeItems: "center", fontWeight: 700 }}>{notifs.length}</span>
        {open && <div style={{ position: "absolute", right: 0, top: 48, width: 290, background: "#fff", borderRadius: 14, boxShadow: "0 8px 32px rgba(0,0,0,.15)", border: "1px solid #eee", zIndex: 200 }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #f5f5f5", fontWeight: 700, fontSize: 13, color: M }}>Recent Activity</div>
          {notifs.map((n, i) => <div key={i} style={{ padding: "10px 16px", borderBottom: "1px solid #fafafa", fontSize: 12, color: "#444" }}>{n}</div>)}
        </div>}
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick, badge }) {
  return (
    <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", borderRadius: 10, background: active ? `${M}15` : "transparent", border: active ? `1px solid ${M}30` : "1px solid transparent", color: active ? M : "#555", fontWeight: active ? 700 : 400, fontSize: 13, cursor: "pointer", width: "100%", textAlign: "left" }}>
      <span style={{ fontSize: 16 }}>{icon}</span>{label}
      {badge && <span style={{ marginLeft: "auto", background: "#E53935", color: "#fff", borderRadius: 20, fontSize: 9, padding: "2px 6px", fontWeight: 700 }}>{badge}</span>}
    </button>
  );
}

function Sidebar({ tab, setTab, role, subRole }) {
  const pm = [["dashboard","Dashboard","🏠"],["fees","Fees & Pay","💳","1 due"],["attendance","Attendance","📅"],["homework","Homework","📖","2"],["online","Online Classes","🎥"],["reportcard","Report Card","📊","New"],["gallery","Photo Gallery","📸","New"],["announcements","Announcements","📢"]];
  const tm = [["dashboard","Dashboard","🏠"],["teacher-attendance","Attendance","📅"],["teacher-exams","Exams & Marks","📝"],["adm-notices","Notices","📢"],["student-profiles","Student Profiles","👤"],["staff-gallery","Photo Gallery","📸"],["adm-requirements","Requirements","🔧"]];
  const am = [["admin-dashboard","Dashboard","📊"],["admin-students","Students","🎓"],["student-profiles","Student Profiles","👤"],["staff-gallery","Photo Gallery","📸"],["admin-admissions","Admissions","📈"],["admin-users","Users","👥"],["admin-defaulters","Defaulters","⚠️"],["admin-requirements","Requirements","🔧","3"],["admin-announcements","Announcements","📢"]];

  // Role-based nav for administration portal
  const admAll = [
    ["adm-dashboard",    "Dashboard",       "🏠"],
    ["adm-fees",         "Fees & Accounts", "💰"],
    ["adm-attendance",   "Attendance",      "📅"],
    ["adm-staff",        "Staff & Leave",   "👨‍💼"],
    ["adm-notices",      "Notices",         "📢"],
    ["adm-exams",        "Exams & Results", "📝"],
    ["adm-admissions",   "Admissions",      "📈"],
    ["adm-requirements", "Requirements",    "🔧","3"],
  ];
  const admNav = {
    principal:   [
      ["adm-dashboard",    "Dashboard",       "🏠"],
      ["adm-defaulters",   "Fee Defaulters",  "⚠️","!"],
      ["adm-attendance",   "Attendance",      "📅"],
      ["adm-staff",        "Staff & Leave",   "👨‍💼"],
      ["adm-notices",      "Notices",         "📢"],
      ["adm-exams",        "Exams & Results", "📝"],
      ["adm-admissions",   "Admissions",      "📈"],
      ["adm-requirements", "Requirements",    "🔧","3"],
      ["student-profiles", "Student Profiles","👤"],
      ["staff-gallery",    "Photo Gallery",   "📸"],
    ],
    accounts:    [...admAll.filter(n => ["adm-dashboard","adm-fees","adm-notices","adm-requirements"].includes(n[0])), ["student-profiles","Student Profiles","👤"], ["staff-gallery","Photo Gallery","📸"]],
    coordinator: [...admAll.filter(n => ["adm-dashboard","adm-attendance","adm-staff","adm-notices","adm-exams","adm-admissions","adm-requirements"].includes(n[0])), ["student-profiles","Student Profiles","👤"], ["staff-gallery","Photo Gallery","📸"]],
  };

  const navItems = role === "admin" ? am : role === "administration" ? (admNav[subRole] || admAll) : role === "teacher" ? tm : pm;
  return (
    <div style={{ width: 210, flexShrink: 0, display: "flex", flexDirection: "column", gap: 3 }}>
      {navItems.map(([k,l,i,b]) => <NavItem key={k} icon={i} label={l} active={tab===k} onClick={() => setTab(k)} badge={b} />)}
    </div>
  );
}

const QA = ({ icon, label, onClick, color = M }) => (
  <button onClick={onClick} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "14px 10px", borderRadius: 14, border: `1.5px solid ${color}25`, background: `${color}0d`, cursor: "pointer", flex: 1, transition: "transform .15s" }}
    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
  ><span style={{ fontSize: 24 }}>{icon}</span><span style={{ fontSize: 11, fontWeight: 600, color, textAlign: "center" }}>{label}</span></button>
);

function LeaveApplicationSheet({ open, onClose }) {
  const [form, setForm] = useState({ from: "", to: "", reason: "", type: "Sick Leave" });
  const [submitted, setSubmitted] = useState(false);
  const reset = () => { setForm({ from: "", to: "", reason: "", type: "Sick Leave" }); setSubmitted(false); onClose(); };
  const submit = () => { if (!form.from || !form.to || !form.reason.trim()) return; setSubmitted(true); };
  const leaveTypes = ["Sick Leave", "Family Function", "Medical Appointment", "Emergency", "Other"];
  return (
    <Sheet open={open} onClose={reset} title="Apply for Leave">
      {!submitted ? (
        <div>
          <div style={{ fontSize: 12, color: "#888", marginBottom: 16 }}>Submitting for: <strong style={{ color: M }}>Aarav Sharma · Class 3</strong></div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Leave Type</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {leaveTypes.map(t => (
                <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))}
                  style={{ padding: "6px 13px", borderRadius: 20, border: `1.5px solid ${form.type === t ? M : "#e0d6cc"}`, background: form.type === t ? M : "transparent", color: form.type === t ? "#fff" : "#555", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>From Date</div>
              <input type="date" value={form.from} onChange={e => setForm(f => ({ ...f, from: e.target.value }))} style={{ ...cardInput, marginBottom: 0 }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>To Date</div>
              <input type="date" value={form.to} min={form.from} onChange={e => setForm(f => ({ ...f, to: e.target.value }))} style={{ ...cardInput, marginBottom: 0 }} />
            </div>
          </div>
          {form.from && form.to && (
            <div style={{ padding: "8px 12px", borderRadius: 8, background: `${BLUE}10`, border: `1px solid ${BLUE}25`, fontSize: 12, color: BLUE, fontWeight: 600, marginBottom: 10 }}>
              📅 {Math.max(1, Math.round((new Date(form.to) - new Date(form.from)) / 86400000) + 1)} day{Math.round((new Date(form.to) - new Date(form.from)) / 86400000) + 1 !== 1 ? "s" : ""} of leave
            </div>
          )}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>Reason</div>
            <textarea
              placeholder="Please describe the reason for leave..."
              rows={3}
              value={form.reason}
              onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
              style={{ ...cardInput, marginBottom: 0, resize: "none", lineHeight: 1.5 }}
            />
          </div>
          <button
            onClick={submit}
            disabled={!form.from || !form.to || !form.reason.trim()}
            style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: (!form.from || !form.to || !form.reason.trim()) ? "#ddd" : `linear-gradient(135deg,${M},${MD})`, color: (!form.from || !form.to || !form.reason.trim()) ? "#aaa" : "#fff", fontSize: 14, fontWeight: 700, cursor: (!form.from || !form.to || !form.reason.trim()) ? "not-allowed" : "pointer", boxShadow: (!form.from || !form.to || !form.reason.trim()) ? "none" : `0 4px 16px ${M}44` }}>
            Submit Leave Application →
          </button>
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "16px 0 8px" }}>
          <div style={{ fontSize: 60, marginBottom: 12 }}>📋</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: GREEN, marginBottom: 6 }}>Application Submitted!</div>
          <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>Your leave request has been sent to the class teacher for approval.</div>
          <div style={{ padding: "12px 16px", borderRadius: 12, background: `${M}08`, border: `1px solid ${M}20`, marginBottom: 20, textAlign: "left" }}>
            <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>Application Summary</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: M }}>{form.type}</div>
            <div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>{new Date(form.from).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – {new Date(form.to).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
            <div style={{ fontSize: 11, color: "#888", marginTop: 4, fontStyle: "italic" }}>"{form.reason}"</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "center", fontSize: 12, color: ORANGE, fontWeight: 600, marginBottom: 20 }}>
            <span>🕐</span> Pending teacher approval
          </div>
          <button onClick={reset} style={{ padding: "10px 32px", borderRadius: 10, border: "none", background: M, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Done</button>
        </div>
      )}
    </Sheet>
  );
}

function ParentDashboard({ setTab, openPay }) {
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [leaveHistory] = useState([
    { type: "Sick Leave", dates: "Feb 10–11", status: "Approved", days: 2 },
    { type: "Family Function", dates: "Jan 22", status: "Approved", days: 1 },
  ]);
  const statusColor = s => s === "Approved" ? GREEN : s === "Rejected" ? RED : ORANGE;
  const statusBg = s => s === "Approved" ? "#E8F5E9" : s === "Rejected" ? "#FFEBEE" : "#FFF8E1";

  return (
    <div>
      <LeaveApplicationSheet open={leaveOpen} onClose={() => setLeaveOpen(false)} />
      <div style={{ fontFamily: "Georgia,serif", color: M, fontSize: 20, fontWeight: 700, marginBottom: 2 }}>Welcome, Mr. Sijariya 👋</div>
      <div style={{ fontSize: 12, color: "#888", marginBottom: 14 }}>Aarav · Class 3 · Roll No. 14</div>
      <div onClick={openPay} style={{ padding: "12px 16px", borderRadius: 12, background: "#FFF8E1", border: "1.5px solid #FFD54F", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, cursor: "pointer" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}><span style={{ fontSize: 20 }}>⚠️</span><div><div style={{ fontSize: 13, fontWeight: 600, color: ORANGE }}>Term 3 fee ₹25,000 due in 3 days</div><div style={{ fontSize: 11, color: "#999" }}>Tap to pay now</div></div></div>
        <span style={{ fontSize: 18, color: M }}>›</span>
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <QA icon="💳" label="Pay Fee" onClick={openPay} color={M} />
        <QA icon="📅" label="Attendance" onClick={() => setTab("attendance")} color={BLUE} />
        <QA icon="📖" label="Homework" onClick={() => setTab("homework")} color={GREEN} />
        <QA icon="🎥" label="Join Class" onClick={() => setTab("online")} color={PURPLE} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
        {[["92%","Attendance",GREEN],["₹25K","Fee Due",ORANGE],["2","HW Pending",M]].map(([v,l,c]) => (
          <div key={l} style={{ background: MC, borderRadius: 14, padding: "14px 12px", border: `1px solid ${c}20`, textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: c }}>{v}</div>
            <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* School Timings - moved up for visibility */}
      <SchoolTimings />

      {/* Leave Application Card */}
      <div style={{ background: MC, borderRadius: 14, padding: 16, border: `1px solid ${M}12`, marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: M, letterSpacing: 1.5, textTransform: "uppercase" }}>Leave Applications</div>
            <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>Apply & track leave requests</div>
          </div>
          <button onClick={() => setLeaveOpen(true)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10, border: "none", background: `linear-gradient(135deg,${M},${MD})`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", boxShadow: `0 3px 12px ${M}40` }}>
            <span style={{ fontSize: 14 }}>📋</span> Apply Leave
          </button>
        </div>
        {leaveHistory.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {leaveHistory.map((l, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: 10, background: statusBg(l.status), border: `1px solid ${statusColor(l.status)}20` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 18 }}>{l.status === "Approved" ? "✅" : l.status === "Rejected" ? "❌" : "🕐"}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#333" }}>{l.type}</div>
                    <div style={{ fontSize: 11, color: "#888" }}>{l.dates} · {l.days} day{l.days !== 1 ? "s" : ""}</div>
                  </div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: statusColor(l.status), padding: "3px 10px", borderRadius: 20, background: "#fff" }}>{l.status}</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "14px 0", color: "#ccc", fontSize: 12 }}>No leave applications yet</div>
        )}
      </div>

      <div style={{ background: MC, borderRadius: 14, padding: 16, border: `1px solid ${M}12`, marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: M, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>Today</div>
        {[["🎥","Science – 3:00 PM","Mrs. Priya Nair",PURPLE],["📐","Maths HW due","Chapter 4 Ex 4.3",ORANGE]].map(([ic,t,s,c]) => (
          <div key={t} style={{ display: "flex", gap: 12, alignItems: "center", padding: "8px 0", borderTop: "1px solid #f0e8df" }}>
            <span style={{ fontSize: 20 }}>{ic}</span>
            <div><div style={{ fontSize: 13, fontWeight: 600, color: c }}>{t}</div><div style={{ fontSize: 11, color: "#888" }}>{s}</div></div>
          </div>
        ))}
      </div>

    </div>
  );
}

function SchoolTimings() {
  const [expanded, setExpanded] = useState(false);

  const now = new Date();
  const dayIndex = now.getDay(); // 0=Sun, 1=Mon...
  const isWeekend = dayIndex === 0 || dayIndex === 6;
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const todayName = days[dayIndex];

  const schedule = [
    { label: "School Opens",        time: "7:30 AM",  icon: "🏫", color: TEAL,   note: "Gates open for students" },
    { label: "Assembly",            time: "8:00 AM",  icon: "🎺", color: PURPLE, note: "Morning assembly & prayer" },
    { label: "Classes Begin",       time: "8:15 AM",  icon: "📚", color: BLUE,   note: "First period starts" },
    { label: "Short Break",         time: "10:15 AM", icon: "☕", color: ORANGE, note: "15-minute recess" },
    { label: "Lunch Break",         time: "12:30 PM", icon: "🍱", color: GREEN,  note: "30-minute lunch break" },
    { label: "Afternoon Classes",   time: "1:00 PM",  icon: "📖", color: BLUE,   note: "Post-lunch sessions" },
    { label: "School Ends",         time: "3:00 PM",  icon: "🔔", color: M,      note: "Dismissal for all classes" },
  ];

  const specialDays = [
    { day: "Monday",    note: "Extra Maths period (3:00–3:45 PM)" },
    { day: "Wednesday", note: "Sports & PT (last 2 periods)" },
    { day: "Friday",    note: "Early dismissal at 2:30 PM" },
  ];

  // Parse time helper
  const parseTime = t => {
    const [time, meridiem] = t.split(" ");
    let [h, m] = time.split(":").map(Number);
    if (meridiem === "PM" && h !== 12) h += 12;
    if (meridiem === "AM" && h === 12) h = 0;
    return h * 60 + m;
  };

  const nowMins = now.getHours() * 60 + now.getMinutes();
  const schoolStart = parseTime("8:15 AM");
  const schoolEnd = parseTime("3:00 PM");
  const isSchoolHours = !isWeekend && nowMins >= parseTime("7:30 AM") && nowMins <= parseTime("3:00 PM");

  // Find current / next event
  let currentIdx = -1;
  for (let i = schedule.length - 1; i >= 0; i--) {
    if (!isWeekend && nowMins >= parseTime(schedule[i].time)) { currentIdx = i; break; }
  }

  return (
    <div style={{ background: MC, borderRadius: 14, border: `1px solid ${M}12`, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${MD} 0%, ${M} 70%, #A03030 100%)`, padding: "14px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22 }}>🕐</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: 0.5 }}>School Timings</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", marginTop: 1 }}>G.L. International School · 2024–25</div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)" }}>{todayName}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: isWeekend ? "#FFD54F" : isSchoolHours ? "#A5D6A7" : "rgba(255,255,255,0.8)", marginTop: 1 }}>
              {isWeekend ? "🏖 No School Today" : isSchoolHours ? "🟢 School In Session" : "⬜ School Closed"}
            </div>
          </div>
        </div>

        {/* Quick summary pills */}
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          {[["🏫 Opens", "7:30 AM"], ["🎺 Assembly", "8:00 AM"], ["📚 Starts", "8:15 AM"], ["🔔 Ends", "3:00 PM"]].map(([l, t]) => (
            <div key={l} style={{ flex: 1, padding: "7px 6px", borderRadius: 8, background: "rgba(255,255,255,0.12)", textAlign: "center" }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.65)", marginBottom: 2 }}>{l}</div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>{t}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's highlight — current/next event */}
      {!isWeekend && (
        <div style={{ padding: "12px 16px", background: currentIdx >= 0 ? `${schedule[currentIdx].color}10` : `${BLUE}08`, borderBottom: `1px solid ${M}10` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
            {currentIdx >= 0 ? "Currently" : "Next"}
          </div>
          {currentIdx >= 0 ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 24 }}>{schedule[currentIdx].icon}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: schedule[currentIdx].color }}>{schedule[currentIdx].label}</div>
                <div style={{ fontSize: 11, color: "#888" }}>{schedule[currentIdx].time} · {schedule[currentIdx].note}</div>
              </div>
              <div style={{ marginLeft: "auto", width: 10, height: 10, borderRadius: "50%", background: schedule[currentIdx].color, boxShadow: `0 0 0 3px ${schedule[currentIdx].color}30`, animation: "pulse 1.5s infinite" }} />
              <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
            </div>
          ) : (
            <div style={{ fontSize: 12, color: "#aaa" }}>School hasn't started yet. See schedule below.</div>
          )}
        </div>
      )}

      {/* Full schedule (expandable) */}
      <div style={{ padding: "12px 16px 0" }}>
        <button onClick={() => setExpanded(e => !e)}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", border: "none", background: "transparent", cursor: "pointer", padding: 0, marginBottom: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: 1 }}>Full Day Schedule</span>
          <span style={{ fontSize: 12, color: M, fontWeight: 700 }}>{expanded ? "▲ Hide" : "▼ Show"}</span>
        </button>

        {expanded && (
          <div style={{ marginBottom: 14 }}>
            {/* Timeline */}
            <div style={{ position: "relative", paddingLeft: 16 }}>
              <div style={{ position: "absolute", left: 19, top: 8, bottom: 8, width: 2, background: `${M}15`, borderRadius: 2 }} />
              {schedule.map((s, i) => {
                const isCurrent = !isWeekend && i === currentIdx;
                const isPast = !isWeekend && nowMins > parseTime(s.time) + (i < schedule.length - 1 ? (parseTime(schedule[i+1].time) - parseTime(s.time)) : 0);
                return (
                  <div key={s.label} style={{ display: "flex", gap: 12, marginBottom: 14, position: "relative", opacity: !isWeekend && nowMins < parseTime(s.time) ? 0.5 : 1 }}>
                    {/* Dot */}
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: isCurrent ? s.color : `${s.color}20`, border: `2px solid ${isCurrent ? s.color : s.color + "40"}`, display: "grid", placeItems: "center", fontSize: 12, flexShrink: 0, zIndex: 1, boxShadow: isCurrent ? `0 0 0 4px ${s.color}20` : "none" }}>
                      {isCurrent ? <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color }} /> : <span style={{ fontSize: 10 }}>{s.icon}</span>}
                    </div>
                    <div style={{ flex: 1, paddingBottom: 2 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ fontSize: 13, fontWeight: isCurrent ? 700 : 600, color: isCurrent ? s.color : "#333" }}>{s.label}</div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: isCurrent ? s.color : "#888", flexShrink: 0, marginLeft: 8 }}>{s.time}</div>
                      </div>
                      <div style={{ fontSize: 11, color: "#aaa", marginTop: 1 }}>{s.note}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Special day notes */}
            <div style={{ background: `${BLUE}08`, borderRadius: 10, padding: "12px 14px", border: `1px solid ${BLUE}20`, marginBottom: 4 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: BLUE, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>📌 Weekly Special Timings</div>
              {specialDays.map(d => (
                <div key={d.day} style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 12 }}>
                  <span style={{ fontWeight: 700, color: d.day === todayName ? M : "#555", minWidth: 90 }}>{d.day === todayName ? `${d.day} ★` : d.day}</span>
                  <span style={{ color: "#777" }}>{d.note}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {!expanded && <div style={{ height: 14 }} />}
    </div>
  );
}

function FeesPage({ openPay }) {
  const fees = [{ term: "Term 1", amount: 25000, status: "Paid", date: "Apr 2024" }, { term: "Term 2", amount: 25000, status: "Paid", date: "Aug 2024" }, { term: "Term 3", amount: 25000, status: "Pending", date: "Mar 2025" }];
  return (
    <div>
      <div style={{ background: `linear-gradient(135deg,${M},${MD})`, borderRadius: 18, padding: "20px 22px", marginBottom: 16, color: "#fff" }}>
        <div style={{ fontSize: 11, opacity: 0.7, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>Amount Due</div>
        <div style={{ fontSize: 36, fontWeight: 800, fontFamily: "Georgia,serif", marginBottom: 4 }}>₹25,000</div>
        <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 16 }}>Term 3 · Due March 15, 2025</div>
        <button onClick={() => openPay(25000, "Term 3")} style={{ padding: "11px 28px", borderRadius: 10, border: "none", background: "#fff", color: M, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Pay Now →</button>
      </div>
      <div style={{ background: MC, borderRadius: 14, overflow: "hidden", border: `1px solid ${M}12` }}>
        <div style={{ padding: "12px 18px 6px", fontSize: 11, fontWeight: 700, color: M, letterSpacing: 1.5, textTransform: "uppercase" }}>Fee Statement 2024–25</div>
        {fees.map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", borderTop: "1px solid #f0e8df" }}>
            <div><div style={{ fontSize: 13, fontWeight: 600 }}>{f.term}</div><div style={{ fontSize: 11, color: "#888" }}>{f.date}</div></div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>₹{f.amount.toLocaleString()}</div>
              {f.status === "Pending" ? <button onClick={() => openPay(f.amount, f.term)} style={{ padding: "5px 14px", borderRadius: 8, border: "none", background: M, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Pay</button>
                : <span style={{ padding: "4px 12px", borderRadius: 20, background: "#E8F5E9", color: GREEN, fontSize: 11, fontWeight: 600 }}>✓ Paid</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AttendancePage() {
  const seed = useRef(42);
  const rng = () => { seed.current = (seed.current * 1664525 + 1013904223) | 0; return (seed.current >>> 0) / 4294967296; };
  const days = Array.from({ length: 31 }, () => { const r = rng(); return r > 0.12 ? "present" : r > 0.05 ? "absent" : "holiday"; });
  const colors = { present: M, absent: "#EF5350", holiday: "#90A4AE", future: "#E0D6CC" };
  return (
    <div>
      <div style={{ background: MC, borderRadius: 14, padding: 18, marginBottom: 14, border: `1px solid ${M}12` }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: M, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>March 2025</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 5 }}>
          {["M","T","W","T","F","S","S"].map((d,i) => <div key={i} style={{ textAlign: "center", fontSize: 10, color: "#bbb", fontWeight: 700 }}>{d}</div>)}
          {days.map((s, i) => <div key={i} style={{ aspectRatio: "1", borderRadius: 7, background: i > 20 ? colors.future : colors[s], opacity: i > 20 ? 0.35 : 1, display: "grid", placeItems: "center", fontSize: 10, color: "#fff", fontWeight: 700 }}>{i + 1}</div>)}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {[["21","Present",M],["4","Absent","#EF5350"],["6","Holidays","#90A4AE"]].map(([v,l,c]) => (
          <div key={l} style={{ background: MC, borderRadius: 12, padding: "14px 12px", textAlign: "center", border: `1px solid ${c}20` }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: c }}>{v}</div>
            <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HomeworkPage() {
  const [done, setDone] = useState({ 2: true });
  const [uploads, setUploads] = useState({});
  const fRefs = useRef({});
  const tasks = [{ id: 1, sub: "Mathematics", desc: "Ch. 4 – Fractions Ex 4.3", due: "Tomorrow", color: ORANGE }, { id: 2, sub: "English", desc: "Essay on 'My School'", due: "Friday", color: GREEN }, { id: 3, sub: "Science", desc: "Water cycle diagram", due: "Monday", color: BLUE }];
  return (
    <div>
      {tasks.map(t => (
        <div key={t.id} style={{ background: MC, borderRadius: 14, padding: "14px 16px", marginBottom: 10, border: `1px solid ${done[t.id] ? "#C8E6C9" : t.color + "25"}`, opacity: done[t.id] ? 0.65 : 1 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <button onClick={() => setDone(d => ({ ...d, [t.id]: !d[t.id] }))} style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${done[t.id] ? GREEN : t.color}`, background: done[t.id] ? GREEN : "transparent", cursor: "pointer", flexShrink: 0, display: "grid", placeItems: "center", color: "#fff", fontSize: 12 }}>{done[t.id] ? "✓" : ""}</button>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: done[t.id] ? "#aaa" : "#222", textDecoration: done[t.id] ? "line-through" : "none" }}>{t.sub}</div>
              <div style={{ fontSize: 11, color: "#888", marginTop: 1 }}>{t.desc}</div>
              {!done[t.id] && <div style={{ display: "flex", gap: 8, marginTop: 9 }}>
                <input type="file" style={{ display: "none" }} ref={el => fRefs.current[t.id] = el} onChange={e => e.target.files[0] && setUploads(u => ({ ...u, [t.id]: e.target.files[0].name }))} />
                <button onClick={() => fRefs.current[t.id]?.click()} style={{ padding: "4px 12px", borderRadius: 7, border: `1.5px dashed ${t.color}60`, background: "transparent", color: t.color, fontSize: 11, cursor: "pointer" }}>📎 {uploads[t.id] || "Attach"}</button>
                {uploads[t.id] && <button onClick={() => setDone(d => ({ ...d, [t.id]: true }))} style={{ padding: "4px 12px", borderRadius: 7, border: "none", background: t.color, color: "#fff", fontSize: 11, cursor: "pointer" }}>Submit →</button>}
              </div>}
            </div>
            <span style={{ fontSize: 10, padding: "3px 9px", borderRadius: 20, background: done[t.id] ? "#E8F5E9" : "#FFF3E0", color: done[t.id] ? GREEN : ORANGE, fontWeight: 600, whiteSpace: "nowrap" }}>{done[t.id] ? "✓ Done" : `Due ${t.due}`}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function OnlineClasses() {
  const cls = [{ sub: "Science", teacher: "Mrs. Priya Nair", time: "Today 3:00 PM", live: true, color: PURPLE }, { sub: "Mathematics", teacher: "Mr. Suresh Iyer", time: "Today 4:30 PM", live: false, color: M }, { sub: "English", teacher: "Ms. Anita Mehta", time: "Tomorrow 9:00 AM", live: false, color: BLUE }];
  return (
    <div>
      {cls.map((c, i) => (
        <div key={i} style={{ background: MC, borderRadius: 14, padding: "14px 16px", marginBottom: 10, border: `1px solid ${c.color}20`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: `${c.color}15`, display: "grid", placeItems: "center", fontSize: 20 }}>🎥</div>
            <div><div style={{ fontWeight: 600, fontSize: 13, color: c.color }}>{c.sub}</div><div style={{ fontSize: 11, color: "#888", marginTop: 1 }}>{c.teacher} · {c.time}</div></div>
          </div>
          {c.live ? <button style={{ padding: "7px 16px", borderRadius: 8, border: "none", background: "#E53935", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>● Join</button>
            : <button style={{ padding: "7px 14px", borderRadius: 8, border: `1.5px solid ${c.color}40`, background: "transparent", color: c.color, fontSize: 11, cursor: "pointer" }}>Remind</button>}
        </div>
      ))}
    </div>
  );
}

function AnnouncementsPage({ isAdmin }) {
  const [posts, setPosts] = useState([{ id: 1, title: "Annual Sports Day", body: "March 20 — all students wear sports uniform.", date: "Mar 5" }, { id: 2, title: "Exam Schedule Released", body: "Term 3 exams start April 7.", date: "Mar 3" }, { id: 3, title: "Holiday – Holi", body: "School closed March 12.", date: "Feb 28" }]);
  const [form, setForm] = useState({ title: "", body: "" });
  const [open, setOpen] = useState(false);
  const post = () => { if (!form.title.trim()) return; setPosts(p => [{ id: Date.now(), ...form, date: "Today" }, ...p]); setForm({ title: "", body: "" }); setOpen(false); };
  return (
    <div>
      {isAdmin && <button onClick={() => setOpen(true)} style={{ marginBottom: 14, padding: "9px 18px", borderRadius: 10, border: "none", background: M, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ Post Announcement</button>}
      <Sheet open={open} onClose={() => setOpen(false)} title="New Announcement">
        <input placeholder="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={cardInput} />
        <textarea placeholder="Message..." rows={3} value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} style={{ ...cardInput, resize: "vertical" }} />
        <button onClick={post} style={{ width: "100%", padding: "11px", borderRadius: 10, border: "none", background: M, color: "#fff", fontWeight: 600, cursor: "pointer" }}>Post →</button>
      </Sheet>
      {posts.map(p => (
        <div key={p.id} style={{ background: MC, borderRadius: 14, padding: "14px 16px", marginBottom: 10, border: `1px solid ${M}12` }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}><div style={{ fontWeight: 700, fontSize: 13, color: M }}>{p.title}</div><div style={{ fontSize: 10, color: "#bbb" }}>{p.date}</div></div>
          <div style={{ fontSize: 12, color: "#555", lineHeight: 1.5 }}>{p.body}</div>
        </div>
      ))}
    </div>
  );
}

function AdminDefaulters() {
  const all = [{ id: 1, name: "Aarav Sharma", cls: "Class 3", amount: 18500, days: 32, phone: "919876543210" }, { id: 2, name: "Diya Verma", cls: "Class 2", amount: 15200, days: 18, phone: "919812345678" }, { id: 3, name: "Kabir Singh", cls: "Class 1", amount: 17400, days: 45, phone: "919899887766" }, { id: 4, name: "Anaya Gupta", cls: "Nursery", amount: 13200, days: 10, phone: "919955443322" }, { id: 5, name: "Vivaan Mehta", cls: "Class 3", amount: 19000, days: 60, phone: "919811112222" }];
  const [cls, setCls] = useState("All");
  const classes = ["All", ...new Set(all.map(s => s.cls))];
  const filtered = cls === "All" ? all : all.filter(s => s.cls === cls);
  const sendWA = (phone, name, amount) => window.open(`https://wa.me/${phone}?text=${encodeURIComponent(`Dear Parent, pending fee for ${name} is ₹${amount.toLocaleString()}. Kindly clear dues.`)}`, "_blank");
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        {classes.map(c => <button key={c} onClick={() => setCls(c)} style={{ padding: "6px 14px", borderRadius: 20, border: "none", background: cls === c ? M : "#eee", color: cls === c ? "#fff" : "#555", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{c}</button>)}
      </div>
      <div style={{ background: MC, borderRadius: 14, overflow: "hidden", border: `1px solid ${M}12` }}>
        {filtered.map((s, i) => (
          <div key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", borderTop: i > 0 ? "1px solid #f0e8df" : "none" }}>
            <div><div style={{ fontWeight: 600, fontSize: 13 }}>{s.name}</div><div style={{ fontSize: 11, color: "#888" }}>{s.cls} · {s.days}d overdue</div></div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ fontWeight: 700, color: RED, fontSize: 14 }}>₹{s.amount.toLocaleString()}</div>
              <button onClick={() => sendWA(s.phone, s.name, s.amount)} style={{ padding: "6px 14px", borderRadius: 8, border: "none", background: "#25D366", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>📲</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminAdmissions() {
  const [cols, setCols] = useState({ "New": [{ id: 1, name: "Riya Sharma", cls: "Class 1" }, { id: 4, name: "Ishan Patel", cls: "Nursery" }], "Documents": [{ id: 2, name: "Arjun Mehta", cls: "Nursery" }], "Interview": [{ id: 3, name: "Sara Khan", cls: "Class 2" }], "Enrolled": [], "Rejected": [] });
  const [dragging, setDragging] = useState(null);
  const colors = { "New": BLUE, "Documents": ORANGE, "Interview": PURPLE, "Enrolled": GREEN, "Rejected": RED };
  const onDrop = col => { if (!dragging) return; setCols(c => { const from = c[dragging.fromCol].filter(a => a.id !== dragging.applicant.id); return { ...c, [dragging.fromCol]: from, [col]: [...c[col], dragging.applicant] }; }); setDragging(null); };
  return (
    <div>
      <div style={{ fontSize: 12, color: "#888", marginBottom: 12 }}>💡 Drag & drop to update stage</div>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8 }}>
        {Object.entries(cols).map(([col, items]) => (
          <div key={col} onDragOver={e => e.preventDefault()} onDrop={() => onDrop(col)} style={{ minWidth: 160, background: MC, borderRadius: 14, padding: "12px 10px", border: `1.5px solid ${colors[col]}30` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: colors[col], textTransform: "uppercase", letterSpacing: 1 }}>{col}</span>
              <span style={{ width: 18, height: 18, borderRadius: "50%", background: `${colors[col]}20`, color: colors[col], fontSize: 10, fontWeight: 700, display: "grid", placeItems: "center" }}>{items.length}</span>
            </div>
            {items.length === 0 && <div style={{ padding: "14px 8px", textAlign: "center", color: "#ddd", fontSize: 11, border: "1.5px dashed #ddd", borderRadius: 8 }}>Drop here</div>}
            {items.map(a => <div key={a.id} draggable onDragStart={() => setDragging({ applicant: a, fromCol: col })} style={{ padding: "10px", borderRadius: 10, marginBottom: 6, background: "#fff", border: `1px solid ${colors[col]}20`, cursor: "grab", boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}><div style={{ fontWeight: 600, fontSize: 12 }}>{a.name}</div><div style={{ fontSize: 10, color: "#888", marginTop: 2 }}>{a.cls}</div></div>)}
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminUsers() {
  const [users, setUsers] = useState([{ id: 1, name: "Siddarth Sijariya", role: "Parent" }, { id: 2, name: "Neha Sharma", role: "Teacher" }]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", role: "Parent" });
  const rC = { Parent: BLUE, Teacher: GREEN, Admin: PURPLE };
  const add = () => { if (!form.name.trim()) return; setUsers(u => [...u, { id: Date.now(), ...form }]); setForm({ name: "", role: "Parent" }); setOpen(false); };
  return (
    <div>
      <button onClick={() => setOpen(true)} style={{ marginBottom: 14, padding: "9px 18px", borderRadius: 10, border: "none", background: M, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ Add User</button>
      <Sheet open={open} onClose={() => setOpen(false)} title="Add User">
        <input placeholder="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={cardInput} />
        <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} style={cardInput}><option>Parent</option><option>Teacher</option><option>Admin</option></select>
        <button onClick={add} style={{ width: "100%", padding: "11px", borderRadius: 10, border: "none", background: M, color: "#fff", fontWeight: 600, cursor: "pointer" }}>Save →</button>
      </Sheet>
      <div style={{ background: MC, borderRadius: 14, overflow: "hidden", border: `1px solid ${M}12` }}>
        {users.map((u, i) => (
          <div key={u.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", borderTop: i > 0 ? "1px solid #f0e8df" : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: `${rC[u.role]}20`, display: "grid", placeItems: "center", fontWeight: 700, fontSize: 13, color: rC[u.role] }}>{u.name[0]}</div>
              <div><div style={{ fontWeight: 600, fontSize: 13 }}>{u.name}</div><span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: `${rC[u.role]}15`, color: rC[u.role], fontWeight: 600 }}>{u.role}</span></div>
            </div>
            <button onClick={() => setUsers(us => us.filter(x => x.id !== u.id))} style={{ padding: "5px 12px", borderRadius: 8, border: "none", background: "#FFEBEE", color: RED, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
//  STAFF PHOTO GALLERY — Upload & Manage
// ═══════════════════════════════════════════

const STORAGE_KEY = "glis-gallery-albums";

function StaffGallery() {
  const [albums, setAlbums]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [activeAlbum, setActiveAlbum] = useState(null);
  const [lightbox, setLightbox]     = useState(null);
  const [newAlbumSheet, setNewAlbumSheet] = useState(false);
  const [uploadSheet, setUploadSheet]   = useState(false);
  const [albumForm, setAlbumForm]   = useState({ title: "", date: "", emoji: "📸", desc: "" });
  const [uploading, setUploading]   = useState(false);
  const fileRef = useRef();

  const EMOJIS = ["📸","🏆","🎭","🎺","🔬","🏰","🪔","🎉","🎓","🌳","⚽","🎨","📚","🎵"];

  // Load albums from shared storage
  const loadAlbums = async () => {
    setLoading(true);
    try {
      const result = await window.storage.get(STORAGE_KEY, true);
      if (result?.value) setAlbums(JSON.parse(result.value));
    } catch { setAlbums([]); }
    setLoading(false);
  };

  const saveAlbums = async (updated) => {
    try { await window.storage.set(STORAGE_KEY, JSON.stringify(updated), true); } catch {}
    setAlbums(updated);
  };

  useEffect(() => { loadAlbums(); }, []);

  // Create new album
  const createAlbum = async () => {
    if (!albumForm.title.trim()) return;
    const newAlbum = {
      id: Date.now(),
      title: albumForm.title.trim(),
      date: albumForm.date || new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
      emoji: albumForm.emoji,
      desc: albumForm.desc.trim(),
      photos: [],
      uploadedBy: "Staff",
      createdAt: new Date().toISOString(),
    };
    await saveAlbums([newAlbum, ...albums]);
    setAlbumForm({ title: "", date: "", emoji: "📸", desc: "" });
    setNewAlbumSheet(false);
  };

  // Upload photos to active album
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length || !activeAlbum) return;
    setUploading(true);
    const newPhotos = [];
    for (const file of files) {
      const base64 = await new Promise(res => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result);
        reader.readAsDataURL(file);
      });
      newPhotos.push({ id: Date.now() + Math.random(), src: base64, label: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "), uploadedAt: new Date().toLocaleTimeString() });
    }
    const updated = albums.map(a =>
      a.id === activeAlbum.id ? { ...a, photos: [...a.photos, ...newPhotos] } : a
    );
    await saveAlbums(updated);
    setActiveAlbum(updated.find(a => a.id === activeAlbum.id));
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  // Delete photo
  const deletePhoto = async (photoId) => {
    const updated = albums.map(a =>
      a.id === activeAlbum.id ? { ...a, photos: a.photos.filter(p => p.id !== photoId) } : a
    );
    await saveAlbums(updated);
    setActiveAlbum(updated.find(a => a.id === activeAlbum.id));
    if (lightbox?.photoId === photoId) setLightbox(null);
  };

  // Delete album
  const deleteAlbum = async (albumId) => {
    const updated = albums.filter(a => a.id !== albumId);
    await saveAlbums(updated);
    setActiveAlbum(null);
  };

  // ── LIGHTBOX ──
  if (lightbox && activeAlbum) {
    const photos = activeAlbum.photos;
    const idx    = photos.findIndex(p => p.id === lightbox.photoId);
    const photo  = photos[idx];
    return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 400, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <button onClick={() => setLightbox(null)} style={{ position: "absolute", top: 18, right: 18, width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", fontSize: 20, cursor: "pointer" }}>✕</button>
        <button onClick={() => deletePhoto(photo.id)} style={{ position: "absolute", top: 18, left: 18, padding: "8px 14px", borderRadius: 10, background: "#E53935", border: "none", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>🗑 Delete</button>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>{activeAlbum.title}</div>
        <img src={photo.src} alt={photo.label} style={{ maxWidth: "85vw", maxHeight: "65vh", borderRadius: 16, objectFit: "contain", boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }} />
        <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginTop: 14, textTransform: "capitalize" }}>{photo.label}</div>
        <div style={{ display: "flex", gap: 14, marginTop: 16 }}>
          <button onClick={() => idx > 0 && setLightbox({ photoId: photos[idx-1].id })} disabled={idx === 0}
            style={{ padding: "9px 22px", borderRadius: 10, border: "none", background: idx > 0 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)", color: idx > 0 ? "#fff" : "rgba(255,255,255,0.2)", fontSize: 13, cursor: idx > 0 ? "pointer" : "default" }}>← Prev</button>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, display: "flex", alignItems: "center" }}>{idx+1} / {photos.length}</span>
          <button onClick={() => idx < photos.length-1 && setLightbox({ photoId: photos[idx+1].id })} disabled={idx === photos.length-1}
            style={{ padding: "9px 22px", borderRadius: 10, border: "none", background: idx < photos.length-1 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)", color: idx < photos.length-1 ? "#fff" : "rgba(255,255,255,0.2)", fontSize: 13, cursor: idx < photos.length-1 ? "pointer" : "default" }}>Next →</button>
        </div>
      </div>
    );
  }

  // ── ALBUM DETAIL ──
  if (activeAlbum) {
    const album = albums.find(a => a.id === activeAlbum.id) || activeAlbum;
    return (
      <div style={{ paddingBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <button onClick={() => setActiveAlbum(null)}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 10, border: `1.5px solid ${M}25`, background: "transparent", color: M, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            ← All Albums
          </button>
          <button onClick={() => deleteAlbum(album.id)}
            style={{ padding: "8px 14px", borderRadius: 10, border: "none", background: "#FFEBEE", color: RED, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>🗑 Delete Album</button>
        </div>

        {/* Album header */}
        <div style={{ background: `linear-gradient(135deg, ${MD} 0%, ${M} 60%, #A03030 100%)`, borderRadius: 16, padding: "16px 20px", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 54, height: 54, borderRadius: 14, background: "rgba(255,255,255,0.2)", display: "grid", placeItems: "center", fontSize: 30 }}>{album.emoji}</div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", fontFamily: "Georgia,serif" }}>{album.title}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 2 }}>📅 {album.date} · {album.photos.length} photo{album.photos.length !== 1 ? "s" : ""}</div>
              {album.desc && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{album.desc}</div>}
            </div>
          </div>
        </div>

        {/* Upload button */}
        <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFileUpload} style={{ display: "none" }} />
        <button onClick={() => fileRef.current?.click()}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, width: "100%", padding: "14px", borderRadius: 13, border: `2px dashed ${M}40`, background: `${M}06`, color: M, fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 18 }}>
          {uploading ? "⏳ Uploading..." : "📤 Tap to Upload Photos"}
        </button>

        {album.photos.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#ccc" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
            <div style={{ fontSize: 14 }}>No photos yet. Upload some above!</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {album.photos.map(p => (
              <div key={p.id} style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${M}15`, cursor: "pointer", position: "relative" }}
                onClick={() => setLightbox({ photoId: p.id })}>
                <img src={p.src} alt={p.label} style={{ width: "100%", height: 100, objectFit: "cover", display: "block" }} />
                <div style={{ padding: "6px 8px", background: MC }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "#444", textTransform: "capitalize", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 16, padding: "10px 14px", borderRadius: 10, background: `${GREEN}08`, border: `1px solid ${GREEN}20`, display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 16 }}>✅</span>
          <span style={{ fontSize: 12, color: "#555" }}>Photos uploaded here will automatically appear in the <strong>Parent Portal Gallery</strong>.</span>
        </div>
      </div>
    );
  }

  // ── ALBUMS GRID ──
  return (
    <div style={{ paddingBottom: 32 }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${MD} 0%, ${M} 60%, #A03030 100%)`, borderRadius: 16, padding: "16px 20px", marginBottom: 20, boxShadow: `0 8px 32px ${M}44` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", fontFamily: "Georgia,serif" }}>📸 Photo Gallery</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 2 }}>Upload event photos — visible to parents instantly</div>
          </div>
          <button onClick={() => setNewAlbumSheet(true)}
            style={{ padding: "9px 16px", borderRadius: 10, border: "none", background: "#fff", color: M, fontSize: 12, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>
            + New Album
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
          {[
            ["📁", albums.length, "Total Albums"],
            ["🖼",  albums.reduce((a,b) => a + b.photos.length, 0), "Total Photos"],
            ["👨‍👩‍👧", "Live", "Parent Visible"],
          ].map(([ic, v, l]) => (
            <div key={l} style={{ padding: "8px", borderRadius: 10, background: "rgba(255,255,255,0.14)", textAlign: "center" }}>
              <div style={{ fontSize: 14 }}>{ic}</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>{v}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.55)", marginTop: 1 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Info banner */}
      <div style={{ display: "flex", gap: 10, padding: "11px 14px", borderRadius: 12, background: `${BLUE}08`, border: `1px solid ${BLUE}20`, marginBottom: 18 }}>
        <span style={{ fontSize: 18 }}>💡</span>
        <span style={{ fontSize: 12, color: "#555", lineHeight: 1.5 }}>
          Create an album for any school event, upload photos, and they will <strong>instantly appear in the Parent Portal</strong> so families can see what happened at school.
        </span>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "#aaa" }}>Loading gallery...</div>
      ) : albums.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 20px" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>📭</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#999", marginBottom: 8 }}>No Albums Yet</div>
          <div style={{ fontSize: 13, color: "#bbb", marginBottom: 20 }}>Create your first album to start sharing event photos with parents.</div>
          <button onClick={() => setNewAlbumSheet(true)}
            style={{ padding: "12px 28px", borderRadius: 12, border: "none", background: `linear-gradient(135deg,${M},${MD})`, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            + Create First Album
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {albums.map(a => (
            <button key={a.id} onClick={() => setActiveAlbum(a)}
              style={{ background: MC, borderRadius: 16, border: `1.5px solid ${M}18`, padding: 0, cursor: "pointer", overflow: "hidden", textAlign: "left", transition: "transform .15s, box-shadow .15s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = `0 8px 24px ${M}20`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}>
              {/* Cover */}
              <div style={{ height: 90, background: `${M}10`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                {a.photos.length > 0
                  ? <img src={a.photos[0].src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <span style={{ fontSize: 48 }}>{a.emoji}</span>
                }
                <div style={{ position: "absolute", top: 8, right: 8, background: M, color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20 }}>
                  {a.photos.length} 📷
                </div>
              </div>
              {/* Info */}
              <div style={{ padding: "10px 12px 12px" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#222", marginBottom: 3 }}>{a.title}</div>
                <div style={{ fontSize: 11, color: "#aaa" }}>📅 {a.date}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8, fontSize: 11, fontWeight: 600, color: M }}>Open <span>→</span></div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* New Album Sheet */}
      <Sheet open={newAlbumSheet} onClose={() => setNewAlbumSheet(false)} title="Create New Album">
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>Album Title</div>
          <input placeholder="e.g. Annual Sports Day 2025" value={albumForm.title} onChange={e => setAlbumForm(f => ({ ...f, title: e.target.value }))} style={cardInput} />
        </div>
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>Event Date</div>
          <input type="date" value={albumForm.date} onChange={e => setAlbumForm(f => ({ ...f, date: new Date(e.target.value).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) }))} style={{ ...cardInput, marginBottom: 0 }} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Album Cover Emoji</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {EMOJIS.map(em => (
              <button key={em} onClick={() => setAlbumForm(f => ({ ...f, emoji: em }))}
                style={{ width: 38, height: 38, borderRadius: 10, border: `2px solid ${albumForm.emoji === em ? M : "#e0d6cc"}`, background: albumForm.emoji === em ? `${M}12` : "transparent", fontSize: 20, cursor: "pointer" }}>
                {em}
              </button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>Short Description (optional)</div>
          <textarea placeholder="Brief description of the event..." rows={2} value={albumForm.desc} onChange={e => setAlbumForm(f => ({ ...f, desc: e.target.value }))} style={{ ...cardInput, resize: "none", marginBottom: 0 }} />
        </div>
        <button onClick={createAlbum} disabled={!albumForm.title.trim()}
          style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: !albumForm.title.trim() ? "#ddd" : `linear-gradient(135deg,${M},${MD})`, color: !albumForm.title.trim() ? "#aaa" : "#fff", fontSize: 14, fontWeight: 700, cursor: !albumForm.title.trim() ? "not-allowed" : "pointer", boxShadow: !albumForm.title.trim() ? "none" : `0 4px 16px ${M}44` }}>
          Create Album →
        </button>
      </Sheet>
    </div>
  );
}

function PhotoGallery() {
  const [activeAlbum, setActiveAlbum] = useState(null);
  const [lightbox, setLightbox]       = useState(null);
  const [uploadedAlbums, setUploadedAlbums] = useState([]);

  // Load staff-uploaded albums from shared storage
  useEffect(() => {
    (async () => {
      try {
        const result = await window.storage.get(STORAGE_KEY, true);
        if (result?.value) setUploadedAlbums(JSON.parse(result.value));
      } catch { setUploadedAlbums([]); }
    })();
  }, []);

  const hardcodedAlbums = [
    {
      id: 1,
      title: "Annual Sports Day",
      date: "20 March 2025",
      emoji: "🏆",
      color: ORANGE,
      count: 6,
      photos: [
        { id: 1, emoji: "🏃", label: "100m Race", bg: "#FFF3E0" },
        { id: 2, emoji: "⚽", label: "Football Match", bg: "#E8F5E9" },
        { id: 3, emoji: "🏅", label: "Prize Distribution", bg: "#E3F2FD" },
        { id: 4, emoji: "🤸", label: "Gymnastics", bg: "#F3E5F5" },
        { id: 5, emoji: "🎽", label: "March Past", bg: "#FFF8E1" },
        { id: 6, emoji: "🎉", label: "Closing Ceremony", bg: "#FCE4EC" },
      ],
    },
    {
      id: 2,
      title: "Republic Day",
      date: "26 January 2025",
      emoji: "🇮🇳",
      color: BLUE,
      count: 4,
      photos: [
        { id: 1, emoji: "🎺", label: "Flag Hoisting", bg: "#E3F2FD" },
        { id: 2, emoji: "🎵", label: "Cultural Program", bg: "#E8F5E9" },
        { id: 3, emoji: "🎤", label: "Speech", bg: "#FFF3E0" },
        { id: 4, emoji: "🍬", label: "Sweet Distribution", bg: "#FCE4EC" },
      ],
    },
    {
      id: 3,
      title: "Science Exhibition",
      date: "15 February 2025",
      emoji: "🔬",
      color: TEAL,
      count: 5,
      photos: [
        { id: 1, emoji: "🚀", label: "Rocket Model", bg: "#E0F2F1" },
        { id: 2, emoji: "⚡", label: "Electric Circuit", bg: "#FFF8E1" },
        { id: 3, emoji: "🌱", label: "Plant Science", bg: "#E8F5E9" },
        { id: 4, emoji: "🔭", label: "Solar System", bg: "#E3F2FD" },
        { id: 5, emoji: "🏆", label: "Winners", bg: "#F3E5F5" },
      ],
    },
    {
      id: 4,
      title: "Diwali Celebration",
      date: "1 November 2024",
      emoji: "🪔",
      color: PURPLE,
      count: 4,
      photos: [
        { id: 1, emoji: "🪔", label: "Diya Decoration", bg: "#FFF3E0" },
        { id: 2, emoji: "🎨", label: "Rangoli", bg: "#FCE4EC" },
        { id: 3, emoji: "👗", label: "Traditional Dress", bg: "#F3E5F5" },
        { id: 4, emoji: "🍭", label: "Sweets", bg: "#E8F5E9" },
      ],
    },
    {
      id: 5,
      title: "Annual Function 2024",
      date: "15 December 2024",
      emoji: "🎭",
      color: M,
      count: 6,
      photos: [
        { id: 1, emoji: "🎭", label: "Drama Performance", bg: "#FCE4EC" },
        { id: 2, emoji: "💃", label: "Classical Dance", bg: "#F3E5F5" },
        { id: 3, emoji: "🎤", label: "Singing", bg: "#E3F2FD" },
        { id: 4, emoji: "🎻", label: "Music Band", bg: "#E8F5E9" },
        { id: 5, emoji: "👑", label: "Best Student Award", bg: "#FFF3E0" },
        { id: 6, emoji: "📸", label: "Group Photo", bg: "#E0F2F1" },
      ],
    },
    {
      id: 6,
      title: "Picnic – Agra Fort",
      date: "5 October 2024",
      emoji: "🏰",
      color: GREEN,
      count: 5,
      photos: [
        { id: 1, emoji: "🚌", label: "Bus Journey", bg: "#E8F5E9" },
        { id: 2, emoji: "🏰", label: "At Agra Fort", bg: "#E3F2FD" },
        { id: 3, emoji: "🍱", label: "Lunch Together", bg: "#FFF3E0" },
        { id: 4, emoji: "🎠", label: "Fun Activities", bg: "#FCE4EC" },
        { id: 5, emoji: "😊", label: "Happy Memories", bg: "#F3E5F5" },
      ],
    },
  ];

  // Merge hardcoded + staff uploaded albums (uploaded ones shown first if any)
  const uploadedFormatted = uploadedAlbums.map(a => ({
    ...a,
    color: M,
    count: a.photos.length,
    isUploaded: true,
  }));
  const albums = [...uploadedFormatted, ...hardcodedAlbums];

  // Lightbox view
  if (lightbox) {
    const album = albums.find(a => a.id === lightbox.albumId);
    const photo = album.photos.find(p => p.id === lightbox.photoId);
    const photoIdx = album.photos.findIndex(p => p.id === lightbox.photoId);
    const prev = album.photos[photoIdx - 1];
    const next = album.photos[photoIdx + 1];
    return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 400, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <button onClick={() => setLightbox(null)} style={{ position: "absolute", top: 20, right: 20, width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", fontSize: 20, cursor: "pointer" }}>✕</button>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>{album.title}</div>
        {photo.src
          ? <img src={photo.src} alt={photo.label} style={{ maxWidth: "82vw", maxHeight: "60vh", borderRadius: 16, objectFit: "contain", boxShadow: "0 20px 60px rgba(0,0,0,0.6)", marginBottom: 16 }} />
          : <div style={{ width: 280, height: 280, borderRadius: 20, background: photo.bg, display: "grid", placeItems: "center", fontSize: 100, boxShadow: "0 20px 60px rgba(0,0,0,0.5)", marginBottom: 16 }}>{photo.emoji}</div>
        }
        <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 20 }}>{photo.label}</div>
        <div style={{ display: "flex", gap: 16 }}>
          <button onClick={() => prev && setLightbox({ albumId: lightbox.albumId, photoId: prev.id })}
            disabled={!prev}
            style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: prev ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)", color: prev ? "#fff" : "rgba(255,255,255,0.2)", fontSize: 14, cursor: prev ? "pointer" : "default" }}>← Prev</button>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, display: "flex", alignItems: "center" }}>{photoIdx + 1} / {album.photos.length}</div>
          <button onClick={() => next && setLightbox({ albumId: lightbox.albumId, photoId: next.id })}
            disabled={!next}
            style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: next ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)", color: next ? "#fff" : "rgba(255,255,255,0.2)", fontSize: 14, cursor: next ? "pointer" : "default" }}>Next →</button>
        </div>
      </div>
    );
  }

  // Album detail view
  if (activeAlbum) {
    const album = albums.find(a => a.id === activeAlbum);
    return (
      <div>
        <button onClick={() => setActiveAlbum(null)}
          style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, padding: "8px 16px", borderRadius: 10, border: `1.5px solid ${M}25`, background: "transparent", color: M, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          ← Back to All Albums
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: `${album.color || M}15`, border: `2px solid ${album.color || M}30`, display: "grid", placeItems: "center", fontSize: 26 }}>{album.emoji}</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: M, fontFamily: "Georgia,serif" }}>{album.title}</div>
            <div style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>📅 {album.date} · {album.photos.length} photos</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {album.photos.map(p => (
            <button key={p.id} onClick={() => setLightbox({ albumId: album.id, photoId: p.id })}
              style={{ background: p.bg || "#f0e8df", borderRadius: 14, border: `1px solid ${album.color || M}20`, padding: 0, cursor: "pointer", overflow: "hidden", transition: "transform .15s" }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
              {p.src
                ? <img src={p.src} alt={p.label} style={{ width: "100%", height: 100, objectFit: "cover", display: "block" }} />
                : <div style={{ height: 100, display: "grid", placeItems: "center", fontSize: 52 }}>{p.emoji}</div>
              }
              <div style={{ padding: "8px 10px 10px", background: "rgba(255,255,255,0.6)", borderTop: `1px solid ${album.color || M}15` }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#444", textAlign: "center" }}>{p.label}</div>
              </div>
            </button>
          ))}
        </div>
        <div style={{ marginTop: 16, padding: "12px 16px", borderRadius: 12, background: `${BLUE}08`, border: `1px solid ${BLUE}20`, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>💡</span>
          <span style={{ fontSize: 12, color: "#555" }}>Tap any photo to view it bigger. Use arrows to browse all photos.</span>
        </div>
      </div>
    );
  }

  // Main albums grid
  return (
    <div>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${MD} 0%, ${M} 60%, #A03030 100%)`, borderRadius: 16, padding: "18px 20px", marginBottom: 20, boxShadow: `0 8px 32px ${M}44` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 28 }}>📸</span>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", fontFamily: "Georgia,serif" }}>Photo Gallery</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 2 }}>School events & memories</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <div style={{ flex: 1, padding: "8px 10px", borderRadius: 10, background: "rgba(255,255,255,0.12)", textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{albums.length}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }}>Albums</div>
          </div>
          <div style={{ flex: 1, padding: "8px 10px", borderRadius: 10, background: "rgba(255,255,255,0.12)", textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{albums.reduce((a, b) => a + b.count, 0)}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }}>Photos</div>
          </div>
          <div style={{ flex: 2, padding: "8px 10px", borderRadius: 10, background: "rgba(255,255,255,0.12)", textAlign: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>2024–25</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }}>Academic Year</div>
          </div>
        </div>
      </div>

      {/* Hint */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 10, background: `${BLUE}08`, border: `1px solid ${BLUE}20`, marginBottom: 16 }}>
        <span style={{ fontSize: 18 }}>👆</span>
        <span style={{ fontSize: 12, color: "#555" }}>Tap any album below to open and view all photos inside.</span>
      </div>

      {/* Albums grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {albums.map(a => (
          <button key={a.id} onClick={() => setActiveAlbum(a.id)}
            style={{ background: MC, borderRadius: 16, border: `1.5px solid ${(a.color||M)}25`, padding: 0, cursor: "pointer", overflow: "hidden", textAlign: "left", transition: "transform .15s, box-shadow .15s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = `0 8px 24px ${a.color||M}25`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}>
            {/* Album cover */}
            <div style={{ height: 90, background: `${a.color||M}12`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
              {a.isUploaded && a.photos.length > 0
                ? <img src={a.photos[0].src} alt={a.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ fontSize: 52 }}>{a.emoji}</span>
              }
              <div style={{ position: "absolute", top: 8, right: 8, background: a.color||M, color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20 }}>{a.photos.length || a.count} 📷</div>
              {a.isUploaded && <div style={{ position: "absolute", top: 8, left: 8, background: GREEN, color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 20 }}>🆕 New</div>}
            </div>
            {/* Album info */}
            <div style={{ padding: "10px 12px 12px" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#222", marginBottom: 3, lineHeight: 1.3 }}>{a.title}</div>
              <div style={{ fontSize: 11, color: "#aaa" }}>📅 {a.date}</div>
              <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: a.color||M }}>
                View Photos <span style={{ fontSize: 14 }}>→</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ReportCard() {
  const [activeTerm, setActiveTerm] = useState("Term 3");

  const student = {
    name: "Aarav Sharma",
    class: "Class 3",
    roll: 14,
    teacher: "Mrs. Priya Nair",
    year: "2024–25",
    totalStudents: 58,
  };

  const terms = {
    "Term 1": {
      subjects: [
        { name: "Mathematics", icon: "📐", marks: 68, classAvg: 71, max: 100 },
        { name: "Science",     icon: "🔬", marks: 74, classAvg: 69, max: 100 },
        { name: "English",     icon: "📖", marks: 81, classAvg: 76, max: 100 },
        { name: "Hindi",       icon: "✍️",  marks: 77, classAvg: 78, max: 100 },
        { name: "Social Sc.",  icon: "🌍", marks: 70, classAvg: 73, max: 100 },
        { name: "Computer",    icon: "💻", marks: 85, classAvg: 74, max: 100 },
      ],
      rank: 18,
      teacherRemark: "Aarav has shown good progress. Needs to focus more on Maths.",
      attendance: 88,
    },
    "Term 2": {
      subjects: [
        { name: "Mathematics", icon: "📐", marks: 72, classAvg: 71, max: 100 },
        { name: "Science",     icon: "🔬", marks: 78, classAvg: 69, max: 100 },
        { name: "English",     icon: "📖", marks: 84, classAvg: 76, max: 100 },
        { name: "Hindi",       icon: "✍️",  marks: 79, classAvg: 78, max: 100 },
        { name: "Social Sc.",  icon: "🌍", marks: 73, classAvg: 73, max: 100 },
        { name: "Computer",    icon: "💻", marks: 88, classAvg: 74, max: 100 },
      ],
      rank: 12,
      teacherRemark: "Excellent improvement in Science and English. Keep it up!",
      attendance: 91,
    },
    "Term 3": {
      subjects: [
        { name: "Mathematics", icon: "📐", marks: 76, classAvg: 71, max: 100 },
        { name: "Science",     icon: "🔬", marks: 82, classAvg: 69, max: 100 },
        { name: "English",     icon: "📖", marks: 88, classAvg: 76, max: 100 },
        { name: "Hindi",       icon: "✍️",  marks: 80, classAvg: 78, max: 100 },
        { name: "Social Sc.",  icon: "🌍", marks: 75, classAvg: 73, max: 100 },
        { name: "Computer",    icon: "💻", marks: 91, classAvg: 74, max: 100 },
      ],
      rank: 8,
      teacherRemark: "Aarav is performing very well across all subjects. A star student!",
      attendance: 92,
    },
  };

  const data = terms[activeTerm];
  const studentTotal = data.subjects.reduce((a, s) => a + s.marks, 0);
  const classTotal   = data.subjects.reduce((a, s) => a + s.classAvg, 0);
  const totalMax     = data.subjects.reduce((a, s) => a + s.max, 0);
  const studentPct   = Math.round(studentTotal / totalMax * 100);
  const classPct     = Math.round(classTotal   / totalMax * 100);
  const overallDelta = studentPct - classPct;

  const aboveCount = data.subjects.filter(s => s.marks > s.classAvg).length;
  const belowCount = data.subjects.filter(s => s.marks < s.classAvg).length;
  const equalCount = data.subjects.filter(s => s.marks === s.classAvg).length;

  const grade = p => p >= 90 ? { g: "A+", color: "#1B5E20", bg: "#E8F5E9", label: "Outstanding" }
    : p >= 80 ? { g: "A",  color: GREEN,  bg: "#E8F5E9", label: "Excellent"  }
    : p >= 70 ? { g: "B+", color: TEAL,   bg: "#E0F2F1", label: "Very Good"  }
    : p >= 60 ? { g: "B",  color: BLUE,   bg: "#E3F2FD", label: "Good"       }
    : p >= 50 ? { g: "C",  color: ORANGE, bg: "#FFF3E0", label: "Average"    }
    :           { g: "D",  color: RED,    bg: "#FFEBEE", label: "Needs Work" };

  /* recharts data */
  const subjectChartData = data.subjects.map(s => ({
    name: s.name.length > 6 ? s.name.slice(0, 6) : s.name,
    "Aarav": s.marks,
    "Class Avg": s.classAvg,
  }));

  const overallChartData = [
    { name: "Class Avg", value: classPct,   fill: "#C4884A66" },
    { name: "Aarav",     value: studentPct, fill: M           },
  ];

  /* custom tooltip with "above/below avg" label */
  const RelTip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const aarav = payload.find(p => p.name === "Aarav")?.value;
    const avg   = payload.find(p => p.name === "Class Avg")?.value;
    const diff  = aarav != null && avg != null ? aarav - avg : null;
    return (
      <div style={{ background: "#fff", borderRadius: 10, padding: "10px 14px", boxShadow: "0 4px 20px rgba(0,0,0,0.12)", border: "1px solid #f0e8df", fontSize: 12 }}>
        <div style={{ fontWeight: 700, color: M, marginBottom: 6 }}>{label}</div>
        {payload.map(p => (
          <div key={p.name} style={{ display: "flex", gap: 7, alignItems: "center", marginBottom: 3 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: p.color || p.fill }} />
            <span style={{ color: "#666" }}>{p.name}:</span>
            <span style={{ fontWeight: 700 }}>{p.value}</span>
          </div>
        ))}
        {diff !== null && (
          <div style={{ marginTop: 6, padding: "4px 8px", borderRadius: 6, background: diff >= 0 ? "#E8F5E9" : "#FFEBEE", fontSize: 11, fontWeight: 700, color: diff >= 0 ? GREEN : RED }}>
            {diff > 0 ? `▲ ${diff} above class avg` : diff < 0 ? `▼ ${Math.abs(diff)} below class avg` : "= Equal to class avg"}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ paddingBottom: 32 }}>

      {/* ── HEADER ── */}
      <div style={{ background: `linear-gradient(135deg, ${MD} 0%, ${M} 60%, #A03030 100%)`, borderRadius: 18, padding: "18px 20px", marginBottom: 18, boxShadow: `0 8px 32px ${M}44` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "grid", placeItems: "center", fontSize: 26, border: "2px solid rgba(255,255,255,0.3)" }}>🎓</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", fontFamily: "Georgia,serif" }}>{student.name}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>{student.class} · Roll No. {student.roll} · {student.year}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", marginTop: 1 }}>Class Teacher: {student.teacher}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {Object.keys(terms).map(t => (
            <button key={t} onClick={() => setActiveTerm(t)}
              style={{ flex: 1, padding: "8px 6px", borderRadius: 10, border: `2px solid ${activeTerm === t ? "#fff" : "rgba(255,255,255,0.2)"}`, background: activeTerm === t ? "#fff" : "rgba(255,255,255,0.1)", color: activeTerm === t ? M : "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── HOW TO READ THIS ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 12, background: `${BLUE}08`, border: `1px solid ${BLUE}20`, marginBottom: 18 }}>
        <span style={{ fontSize: 20 }}>💡</span>
        <span style={{ fontSize: 12, color: "#555", lineHeight: 1.5 }}>
          This card shows how <strong style={{ color: M }}>Aarav</strong> is doing compared to the <strong style={{ color: BLUE }}>Class Average</strong> — so you can see exactly where he stands among all {student.totalStudents} students.
        </span>
      </div>

      {/* ── TOP 4 KPI CARDS ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 18 }}>
        {[
          { label: "Aarav's Avg",   val: `${studentPct}%`, icon: "🎯", color: M,      sub: `${studentTotal}/${totalMax} marks` },
          { label: "Class Avg",     val: `${classPct}%`,   icon: "👥", color: BLUE,   sub: `${student.totalStudents} students` },
          { label: "vs Class",      val: `${overallDelta >= 0 ? "+" : ""}${overallDelta}%`, icon: overallDelta >= 0 ? "📈" : "📉", color: overallDelta >= 0 ? GREEN : RED, sub: overallDelta >= 0 ? "Above average" : "Below average" },
          { label: "Class Rank",    val: `#${data.rank}`,  icon: "🏅", color: PURPLE, sub: `of ${student.totalStudents} students` },
        ].map(k => (
          <div key={k.label} style={{ background: MC, borderRadius: 13, padding: "12px 10px", border: `1px solid ${k.color}20`, textAlign: "center" }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{k.icon}</div>
            <div style={{ fontSize: 17, fontWeight: 900, color: k.color, fontFamily: "Georgia,serif" }}>{k.val}</div>
            <div style={{ fontSize: 9, fontWeight: 700, color: k.color, textTransform: "uppercase", letterSpacing: 0.8, marginTop: 3 }}>{k.label}</div>
            <div style={{ fontSize: 9, color: "#aaa", marginTop: 2 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* ── SUBJECT MARKS LIST ── */}
      <div style={{ background: MC, borderRadius: 16, padding: "16px 18px", marginBottom: 18, border: `1px solid ${M}12` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: 1.5 }}>📋 Subject-wise Marks</div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#666" }}><div style={{ width: 10, height: 10, borderRadius: "50%", background: M }} />Aarav</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#666" }}><div style={{ width: 10, height: 10, borderRadius: "50%", background: BLUE + "66" }} />Class Avg</div>
          </div>
        </div>
        {data.subjects.map((s, i) => {
          const sp  = Math.round(s.marks    / s.max * 100);
          const cp  = Math.round(s.classAvg / s.max * 100);
          const diff = s.marks - s.classAvg;
          const isAbove = diff > 0, isEqual = diff === 0;
          const g = grade(sp);
          return (
            <div key={s.name} style={{ marginBottom: i < data.subjects.length - 1 ? 16 : 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20, width: 28, textAlign: "center", flexShrink: 0 }}>{s.icon}</span>
                <div style={{ flex: 1 }}>
                  {/* Row 1 — subject name + marks + badge */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#222" }}>{s.name}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <span style={{ fontSize: 12, fontWeight: 800, color: "#333" }}>{s.marks}<span style={{ fontWeight: 400, color: "#aaa", fontSize: 10 }}>/{s.max}</span></span>
                      <span style={{ padding: "2px 9px", borderRadius: 20, background: g.bg, color: g.color, fontSize: 10, fontWeight: 700 }}>{g.g}</span>
                      <span style={{ padding: "2px 9px", borderRadius: 20, fontSize: 10, fontWeight: 700,
                        background: isAbove ? "#E8F5E9" : isEqual ? "#F5F5F5" : "#FFEBEE",
                        color: isAbove ? GREEN : isEqual ? "#888" : RED }}>
                        {isAbove ? `▲ +${diff}` : isEqual ? "= Avg" : `▼ ${diff}`}
                      </span>
                    </div>
                  </div>
                  {/* Dual bar track */}
                  <div style={{ position: "relative", height: 20 }}>
                    {/* Class avg bar (background) */}
                    <div style={{ position: "absolute", top: 6, left: 0, width: `${cp}%`, height: 8, borderRadius: 6, background: BLUE + "33" }} />
                    {/* Student bar */}
                    <div style={{ position: "absolute", top: 6, left: 0, width: `${sp}%`, height: 8, borderRadius: 6, background: isAbove ? g.color : isEqual ? "#aaa" : RED, opacity: 0.85, transition: "width 1s ease" }} />
                    {/* Class avg pin */}
                    <div style={{ position: "absolute", top: 2, left: `${cp}%`, transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
                      <div style={{ width: 2, height: 16, background: BLUE, borderRadius: 2 }} />
                    </div>
                  </div>
                  {/* Labels below bar */}
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
                    <span style={{ fontSize: 9, color: BLUE, fontWeight: 600 }}>Class Avg: {s.classAvg}</span>
                    <span style={{ fontSize: 9, color: isAbove ? GREEN : isEqual ? "#888" : RED, fontWeight: 600 }}>
                      {isAbove ? `${diff} above avg` : isEqual ? "Equal to avg" : `${Math.abs(diff)} below avg`}
                    </span>
                  </div>
                </div>
              </div>
              {i < data.subjects.length - 1 && <div style={{ height: 1, background: "#f0e8df", marginLeft: 38, marginTop: 10 }} />}
            </div>
          );
        })}

        {/* Summary chips */}
        <div style={{ display: "flex", gap: 8, marginTop: 16, padding: "12px 14px", borderRadius: 12, background: "#FAFAF8", border: "1px solid #f0e8df" }}>
          <div style={{ flex: 1, textAlign: "center", padding: "8px 4px", borderRadius: 8, background: "#E8F5E9" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: GREEN }}>{aboveCount}</div>
            <div style={{ fontSize: 9, color: GREEN, fontWeight: 600 }}>Above Avg</div>
          </div>
          <div style={{ flex: 1, textAlign: "center", padding: "8px 4px", borderRadius: 8, background: "#F5F5F5" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#888" }}>{equalCount}</div>
            <div style={{ fontSize: 9, color: "#888", fontWeight: 600 }}>Equal</div>
          </div>
          <div style={{ flex: 1, textAlign: "center", padding: "8px 4px", borderRadius: 8, background: "#FFEBEE" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: RED }}>{belowCount}</div>
            <div style={{ fontSize: 9, color: RED, fontWeight: 600 }}>Below Avg</div>
          </div>
        </div>
      </div>

      {/* ── OVERALL COMPARISON GRAPH ── */}
      <div style={{ background: MC, borderRadius: 16, padding: "16px 18px", marginBottom: 18, border: `1px solid ${M}12` }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 2 }}>📊 Overall: Aarav vs Class Average</div>
        <div style={{ fontSize: 11, color: "#aaa", marginBottom: 14 }}>Total percentage — who scored more overall?</div>
        <div style={{ display: "flex", gap: 20, alignItems: "flex-end", justifyContent: "center", height: 170, padding: "0 30px" }}>
          {overallChartData.map((d, i) => {
            const isStudent = d.name === "Aarav";
            const diff = studentPct - classPct;
            return (
              <div key={d.name} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                {isStudent && diff !== 0 && (
                  <div style={{ fontSize: 11, fontWeight: 700, color: diff > 0 ? GREEN : RED, marginBottom: 2 }}>
                    {diff > 0 ? `▲ +${diff}%` : `▼ ${diff}%`}
                  </div>
                )}
                {!isStudent && <div style={{ fontSize: 11, color: "transparent" }}>_</div>}
                <div style={{ fontSize: 15, fontWeight: 800, color: isStudent ? M : BLUE }}>{d.value}%</div>
                <div style={{ width: "100%", maxWidth: 90, height: `${d.value * 1.4}px`, borderRadius: "10px 10px 0 0",
                  background: isStudent ? `linear-gradient(180deg, ${M} 0%, ${MD} 100%)` : `linear-gradient(180deg, ${BLUE}88 0%, ${BLUE}44 100%)`,
                  transition: "height 1.2s ease", position: "relative", boxShadow: isStudent ? `0 -4px 16px ${M}33` : "none" }} />
                <div style={{ fontSize: 12, fontWeight: 700, color: isStudent ? M : BLUE, textAlign: "center", lineHeight: 1.3 }}>{d.name}</div>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#666" }}><div style={{ width: 12, height: 12, borderRadius: 3, background: M }} />Aarav's Score</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#666" }}><div style={{ width: 12, height: 12, borderRadius: 3, background: BLUE + "88" }} />Class Average</div>
        </div>
      </div>

      {/* ── SUBJECT-WISE COMPARISON GRAPH ── */}
      <div style={{ background: MC, borderRadius: 16, padding: "16px 18px", marginBottom: 18, border: `1px solid ${M}12` }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 2 }}>📈 Subject-wise: Aarav vs Class Average</div>
        <div style={{ fontSize: 11, color: "#aaa", marginBottom: 14 }}>Each subject side by side — spot where he leads or lags</div>
        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={subjectChartData} barCategoryGap="22%" barGap={3}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0e8df" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#888" }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#ccc" }} axisLine={false} tickLine={false} width={24} />
            <Tooltip content={<RelTip />} cursor={{ fill: `${M}06` }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="Class Avg" fill={BLUE + "66"} radius={[4, 4, 0, 0]} />
            <Bar dataKey="Aarav"     fill={M}           radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── SPOTLIGHT ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
        {(() => {
          const best  = [...data.subjects].sort((a, b) => (b.marks - b.classAvg) - (a.marks - a.classAvg))[0];
          const worst = [...data.subjects].sort((a, b) => (a.marks - a.classAvg) - (b.marks - b.classAvg))[0];
          return (<>
            <div style={{ padding: "14px", borderRadius: 14, background: "#E8F5E9", border: "1px solid #A5D6A730" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: GREEN, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>🌟 Strongest Subject</div>
              <div style={{ fontSize: 24, marginBottom: 4 }}>{best.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#222" }}>{best.name}</div>
              <div style={{ fontSize: 12, color: GREEN, fontWeight: 700, marginTop: 4 }}>+{best.marks - best.classAvg} above class avg</div>
              <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>Score: {best.marks} · Avg: {best.classAvg}</div>
            </div>
            <div style={{ padding: "14px", borderRadius: 14, background: "#FFEBEE", border: "1px solid #EF9A9A30" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: RED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>🎯 Needs Focus</div>
              <div style={{ fontSize: 24, marginBottom: 4 }}>{worst.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#222" }}>{worst.name}</div>
              <div style={{ fontSize: 12, color: RED, fontWeight: 700, marginTop: 4 }}>{worst.marks - worst.classAvg >= 0 ? `+${worst.marks - worst.classAvg} above avg` : `${worst.marks - worst.classAvg} below avg`}</div>
              <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>Score: {worst.marks} · Avg: {worst.classAvg}</div>
            </div>
          </>);
        })()}
      </div>

      {/* ── TEACHER REMARK ── */}
      <div style={{ background: `${M}08`, borderRadius: 14, padding: "14px 16px", border: `1px solid ${M}20` }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>👩‍🏫 Class Teacher's Remark</div>
        <div style={{ fontSize: 13, color: "#444", lineHeight: 1.6, fontStyle: "italic" }}>"{data.teacherRemark}"</div>
        <div style={{ fontSize: 11, color: "#aaa", marginTop: 8 }}>— {student.teacher}, {student.class}</div>
      </div>

    </div>
  );
}

// ═══════════════════════════════════════════
//  STUDENT PROFILES — SHARED ACROSS PORTALS
// ═══════════════════════════════════════════

const STUDENTS_DB = [
  {
    id: 1,
    name: "Aarav Sharma",       admNo: "GLIS-2021-001", roll: 14, cls: "Class 3", section: "A",
    dob: "12 Aug 2016",         gender: "Male",          blood: "B+", nationality: "Indian",
    religion: "Hindu",          category: "General",     house: "Red House",
    photo: "🧒",
    address: { line1: "47, Shivaji Nagar", line2: "Near Ram Temple", city: "Agra", state: "Uttar Pradesh", pin: "282001" },
    father:  { name: "Mr. Rajesh Sharma",  occ: "Business",     phone: "98765-43210", email: "rajesh.sharma@gmail.com" },
    mother:  { name: "Mrs. Sunita Sharma", occ: "Homemaker",    phone: "87654-32109", email: "sunita.sharma@gmail.com" },
    guardian:{ name: "Mr. Rajesh Sharma",  relation: "Father",  phone: "98765-43210" },
    busRoute: "Route 3 – Shivaji Nagar",   busStop: "Ram Temple Stop",
    medicalInfo: { allergies: "None", conditions: "None", doctorName: "Dr. Anil Gupta", doctorPhone: "94321-XXXXX" },
    feeStatus: [
      { term: "Term 1", amount: 15000, paid: 15000, date: "Apr 5, 2024",  status: "Paid"    },
      { term: "Term 2", amount: 15000, paid: 15000, date: "Sep 8, 2024",  status: "Paid"    },
      { term: "Term 3", amount: 15000, paid: 0,     date: "–",            status: "Pending" },
    ],
    attendance: { total: 180, present: 166, byMonth: [
      { m: "Apr", p: 24, t: 25 }, { m: "May", p: 20, t: 22 }, { m: "Jun", p: 18, t: 20 },
      { m: "Jul", p: 25, t: 26 }, { m: "Aug", p: 23, t: 24 }, { m: "Sep", p: 22, t: 23 },
      { m: "Oct", p: 18, t: 20 }, { m: "Nov", p: 16, t: 20 },
    ]},
    results: {
      "Term 1": [{ sub: "Mathematics", marks: 68, max: 100 },{ sub: "Science", marks: 74, max: 100 },{ sub: "English", marks: 81, max: 100 },{ sub: "Hindi", marks: 77, max: 100 },{ sub: "Social Sc.", marks: 70, max: 100 },{ sub: "Computer", marks: 85, max: 100 }],
      "Term 2": [{ sub: "Mathematics", marks: 72, max: 100 },{ sub: "Science", marks: 78, max: 100 },{ sub: "English", marks: 84, max: 100 },{ sub: "Hindi", marks: 79, max: 100 },{ sub: "Social Sc.", marks: 73, max: 100 },{ sub: "Computer", marks: 88, max: 100 }],
      "Term 3": [{ sub: "Mathematics", marks: 76, max: 100 },{ sub: "Science", marks: 82, max: 100 },{ sub: "English", marks: 88, max: 100 },{ sub: "Hindi", marks: 80, max: 100 },{ sub: "Social Sc.", marks: 75, max: 100 },{ sub: "Computer", marks: 91, max: 100 }],
    },
    teacherRemark: "Aarav is a sincere and hardworking student. Excellent improvement across all terms.",
    conduct: "Excellent", rank: 8, totalStudents: 58,
  },
  {
    id: 2,
    name: "Kavya Singh",        admNo: "GLIS-2020-047", roll: 22, cls: "Class 3", section: "A",
    dob: "3 Mar 2016",          gender: "Female",        blood: "O+", nationality: "Indian",
    religion: "Hindu",          category: "OBC",         house: "Blue House",
    photo: "👧",
    address: { line1: "12, Taj Colony", line2: "Fatehabad Road", city: "Agra", state: "Uttar Pradesh", pin: "282004" },
    father:  { name: "Mr. Vikram Singh",   occ: "Govt. Service", phone: "76543-21098", email: "vikram.singh@yahoo.com" },
    mother:  { name: "Mrs. Pooja Singh",   occ: "Teacher",       phone: "65432-10987", email: "pooja.singh@gmail.com" },
    guardian:{ name: "Mr. Vikram Singh",   relation: "Father",   phone: "76543-21098" },
    busRoute: "Route 5 – Fatehabad Road",  busStop: "Taj Colony Gate",
    medicalInfo: { allergies: "Dust allergy", conditions: "Mild asthma", doctorName: "Dr. Priya Mehta", doctorPhone: "93210-XXXXX" },
    feeStatus: [
      { term: "Term 1", amount: 15000, paid: 15000, date: "Apr 3, 2024",  status: "Paid"    },
      { term: "Term 2", amount: 15000, paid: 15000, date: "Sep 10, 2024", status: "Paid"    },
      { term: "Term 3", amount: 15000, paid: 0,     date: "–",            status: "Overdue" },
    ],
    attendance: { total: 180, present: 154, byMonth: [
      { m: "Apr", p: 22, t: 25 }, { m: "May", p: 18, t: 22 }, { m: "Jun", p: 16, t: 20 },
      { m: "Jul", p: 23, t: 26 }, { m: "Aug", p: 21, t: 24 }, { m: "Sep", p: 20, t: 23 },
      { m: "Oct", p: 17, t: 20 }, { m: "Nov", p: 17, t: 20 },
    ]},
    results: {
      "Term 1": [{ sub: "Mathematics", marks: 55, max: 100 },{ sub: "Science", marks: 60, max: 100 },{ sub: "English", marks: 72, max: 100 },{ sub: "Hindi", marks: 80, max: 100 },{ sub: "Social Sc.", marks: 65, max: 100 },{ sub: "Computer", marks: 70, max: 100 }],
      "Term 2": [{ sub: "Mathematics", marks: 58, max: 100 },{ sub: "Science", marks: 63, max: 100 },{ sub: "English", marks: 75, max: 100 },{ sub: "Hindi", marks: 83, max: 100 },{ sub: "Social Sc.", marks: 68, max: 100 },{ sub: "Computer", marks: 74, max: 100 }],
      "Term 3": [{ sub: "Mathematics", marks: 62, max: 100 },{ sub: "Science", marks: 66, max: 100 },{ sub: "English", marks: 78, max: 100 },{ sub: "Hindi", marks: 85, max: 100 },{ sub: "Social Sc.", marks: 70, max: 100 },{ sub: "Computer", marks: 76, max: 100 }],
    },
    teacherRemark: "Kavya is strong in Hindi and English. Needs to work harder on Mathematics.",
    conduct: "Good", rank: 32, totalStudents: 58,
  },
  {
    id: 3,
    name: "Rohan Mehta",        admNo: "GLIS-2019-112", roll: 5,  cls: "Class 4", section: "A",
    dob: "20 Nov 2015",         gender: "Male",          blood: "A+", nationality: "Indian",
    religion: "Jain",           category: "General",     house: "Green House",
    photo: "👦",
    address: { line1: "8, Sadar Bazar", line2: "Near Clock Tower", city: "Agra", state: "Uttar Pradesh", pin: "282001" },
    father:  { name: "Mr. Sunil Mehta",    occ: "Businessman",   phone: "55432-10987", email: "sunil.mehta@gmail.com" },
    mother:  { name: "Mrs. Anita Mehta",   occ: "Homemaker",     phone: "44321-09876", email: "anita.mehta@gmail.com" },
    guardian:{ name: "Mr. Sunil Mehta",    relation: "Father",   phone: "55432-10987" },
    busRoute: "Route 1 – Sadar Bazar",     busStop: "Clock Tower Stop",
    medicalInfo: { allergies: "None", conditions: "None", doctorName: "Dr. Ramesh Shah", doctorPhone: "91234-XXXXX" },
    feeStatus: [
      { term: "Term 1", amount: 15000, paid: 15000, date: "Apr 1, 2024",  status: "Paid"    },
      { term: "Term 2", amount: 15000, paid: 15000, date: "Sep 2, 2024",  status: "Paid"    },
      { term: "Term 3", amount: 15000, paid: 15000, date: "Jan 5, 2025",  status: "Paid"    },
    ],
    attendance: { total: 180, present: 175, byMonth: [
      { m: "Apr", p: 25, t: 25 }, { m: "May", p: 22, t: 22 }, { m: "Jun", p: 20, t: 20 },
      { m: "Jul", p: 26, t: 26 }, { m: "Aug", p: 23, t: 24 }, { m: "Sep", p: 22, t: 23 },
      { m: "Oct", p: 19, t: 20 }, { m: "Nov", p: 18, t: 20 },
    ]},
    results: {
      "Term 1": [{ sub: "Mathematics", marks: 88, max: 100 },{ sub: "Science", marks: 85, max: 100 },{ sub: "English", marks: 79, max: 100 },{ sub: "Hindi", marks: 72, max: 100 },{ sub: "Social Sc.", marks: 80, max: 100 },{ sub: "Computer", marks: 92, max: 100 }],
      "Term 2": [{ sub: "Mathematics", marks: 90, max: 100 },{ sub: "Science", marks: 88, max: 100 },{ sub: "English", marks: 82, max: 100 },{ sub: "Hindi", marks: 74, max: 100 },{ sub: "Social Sc.", marks: 83, max: 100 },{ sub: "Computer", marks: 95, max: 100 }],
      "Term 3": [{ sub: "Mathematics", marks: 93, max: 100 },{ sub: "Science", marks: 91, max: 100 },{ sub: "English", marks: 85, max: 100 },{ sub: "Hindi", marks: 76, max: 100 },{ sub: "Social Sc.", marks: 85, max: 100 },{ sub: "Computer", marks: 97, max: 100 }],
    },
    teacherRemark: "Rohan is an outstanding student. Class topper in Mathematics and Computer Science.",
    conduct: "Excellent", rank: 1, totalStudents: 55,
  },
  {
    id: 4,
    name: "Priya Patel",        admNo: "GLIS-2022-033", roll: 18, cls: "Nursery", section: "A",
    dob: "7 Jan 2020",          gender: "Female",        blood: "AB+", nationality: "Indian",
    religion: "Hindu",          category: "General",     house: "Yellow House",
    photo: "👧",
    address: { line1: "33, Pratap Nagar", line2: "Bypass Road", city: "Agra", state: "Uttar Pradesh", pin: "282007" },
    father:  { name: "Mr. Dinesh Patel",   occ: "Engineer",     phone: "33210-98765", email: "dinesh.patel@gmail.com" },
    mother:  { name: "Mrs. Rekha Patel",   occ: "Doctor",       phone: "22109-87654", email: "rekha.patel@gmail.com" },
    guardian:{ name: "Mrs. Rekha Patel",   relation: "Mother",  phone: "22109-87654" },
    busRoute: "Route 7 – Bypass Road",    busStop: "Pratap Nagar Stop",
    medicalInfo: { allergies: "Peanuts", conditions: "None", doctorName: "Mrs. Rekha Patel (Mother)", doctorPhone: "22109-87654" },
    feeStatus: [
      { term: "Term 1", amount: 12000, paid: 12000, date: "Apr 8, 2024",  status: "Paid"    },
      { term: "Term 2", amount: 12000, paid: 12000, date: "Sep 6, 2024",  status: "Paid"    },
      { term: "Term 3", amount: 12000, paid: 0,     date: "–",            status: "Pending" },
    ],
    attendance: { total: 160, present: 148, byMonth: [
      { m: "Apr", p: 22, t: 23 }, { m: "May", p: 19, t: 20 }, { m: "Jun", p: 17, t: 18 },
      { m: "Jul", p: 23, t: 24 }, { m: "Aug", p: 20, t: 22 }, { m: "Sep", p: 20, t: 21 },
      { m: "Oct", p: 15, t: 17 }, { m: "Nov", p: 12, t: 15 },
    ]},
    results: {
      "Term 1": [{ sub: "English", marks: 18, max: 25 },{ sub: "Hindi", marks: 20, max: 25 },{ sub: "Maths", marks: 22, max: 25 },{ sub: "Drawing", marks: 24, max: 25 }],
      "Term 2": [{ sub: "English", marks: 20, max: 25 },{ sub: "Hindi", marks: 21, max: 25 },{ sub: "Maths", marks: 23, max: 25 },{ sub: "Drawing", marks: 25, max: 25 }],
      "Term 3": [{ sub: "English", marks: 22, max: 25 },{ sub: "Hindi", marks: 23, max: 25 },{ sub: "Maths", marks: 24, max: 25 },{ sub: "Drawing", marks: 25, max: 25 }],
    },
    teacherRemark: "Priya is a bright and cheerful child. Excellent in Drawing and Mathematics.",
    conduct: "Excellent", rank: 3, totalStudents: 45,
  },
  {
    id: 5,
    name: "Aryan Mehta",        admNo: "GLIS-2018-006", roll: 2,  cls: "Class 5", section: "A",
    dob: "15 Jun 2014",         gender: "Male",          blood: "B-", nationality: "Indian",
    religion: "Hindu",          category: "General",     house: "Red House",
    photo: "🧒",
    address: { line1: "22, Civil Lines", line2: "Near Collectorate", city: "Agra", state: "Uttar Pradesh", pin: "282002" },
    father:  { name: "Mr. Anil Mehta",     occ: "Advocate",     phone: "11098-76543", email: "anil.mehta@gmail.com"  },
    mother:  { name: "Mrs. Sunita Mehta",  occ: "Homemaker",    phone: "00987-65432", email: "sunita.mehta@gmail.com"},
    guardian:{ name: "Mr. Anil Mehta",     relation: "Father",  phone: "11098-76543" },
    busRoute: "Route 2 – Civil Lines",    busStop: "Collectorate Stop",
    medicalInfo: { allergies: "None", conditions: "Spectacles (-1.5)", doctorName: "Dr. Vikas Jain", doctorPhone: "90123-XXXXX" },
    feeStatus: [
      { term: "Term 1", amount: 15000, paid: 15000, date: "Apr 2, 2024",  status: "Paid"    },
      { term: "Term 2", amount: 15000, paid: 15000, date: "Sep 4, 2024",  status: "Paid"    },
      { term: "Term 3", amount: 15000, paid: 0,     date: "–",            status: "Overdue" },
    ],
    attendance: { total: 180, present: 138, byMonth: [
      { m: "Apr", p: 20, t: 25 }, { m: "May", p: 16, t: 22 }, { m: "Jun", p: 14, t: 20 },
      { m: "Jul", p: 21, t: 26 }, { m: "Aug", p: 19, t: 24 }, { m: "Sep", p: 17, t: 23 },
      { m: "Oct", p: 15, t: 20 }, { m: "Nov", p: 16, t: 20 },
    ]},
    results: {
      "Term 1": [{ sub: "Mathematics", marks: 45, max: 100 },{ sub: "Science", marks: 52, max: 100 },{ sub: "English", marks: 60, max: 100 },{ sub: "Hindi", marks: 58, max: 100 },{ sub: "Social Sc.", marks: 55, max: 100 },{ sub: "Computer", marks: 65, max: 100 }],
      "Term 2": [{ sub: "Mathematics", marks: 48, max: 100 },{ sub: "Science", marks: 55, max: 100 },{ sub: "English", marks: 63, max: 100 },{ sub: "Hindi", marks: 60, max: 100 },{ sub: "Social Sc.", marks: 57, max: 100 },{ sub: "Computer", marks: 68, max: 100 }],
      "Term 3": [{ sub: "Mathematics", marks: 52, max: 100 },{ sub: "Science", marks: 59, max: 100 },{ sub: "English", marks: 66, max: 100 },{ sub: "Hindi", marks: 63, max: 100 },{ sub: "Social Sc.", marks: 60, max: 100 },{ sub: "Computer", marks: 71, max: 100 }],
    },
    teacherRemark: "Aryan needs to improve attendance and focus on studies. Has potential but lacks consistency.",
    conduct: "Average", rank: 44, totalStudents: 50,
  },
];

function StudentDirectory() {
  const [selected, setSelected] = useState(null);
  const [search, setSearch]     = useState("");
  const [filterCls, setFilterCls] = useState("All");

  const classes = ["All", "Nursery", "LKG", "UKG", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5"];

  const filtered = STUDENTS_DB
    .filter(s => filterCls === "All" || s.cls === filterCls)
    .filter(s => s.name.toLowerCase().includes(search.toLowerCase()) ||
                 s.admNo.toLowerCase().includes(search.toLowerCase()) ||
                 String(s.roll).includes(search));

  if (selected) return <StudentProfile student={selected} onBack={() => setSelected(null)} />;

  return (
    <div style={{ paddingBottom: 32 }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${MD} 0%, ${M} 60%, #A03030 100%)`, borderRadius: 16, padding: "16px 20px", marginBottom: 20, boxShadow: `0 8px 32px ${M}44` }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", fontFamily: "Georgia,serif", marginBottom: 2 }}>👤 Student Profiles</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginBottom: 14 }}>Search any student to view their complete profile</div>
        {/* Search bar */}
        <div style={{ display: "flex", gap: 10, background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "10px 14px", alignItems: "center", border: "1px solid rgba(255,255,255,0.25)" }}>
          <span style={{ fontSize: 16 }}>🔍</span>
          <input
            placeholder="Search by name, admission no. or roll no..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 13, color: "#fff" }}
          />
          {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer", fontSize: 16 }}>✕</button>}
        </div>
      </div>

      {/* Class filter */}
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 18 }}>
        {classes.map(c => (
          <button key={c} onClick={() => setFilterCls(c)}
            style={{ padding: "5px 14px", borderRadius: 20, border: "none", background: filterCls === c ? M : "#eee", color: filterCls === c ? "#fff" : "#555", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
            {c}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div style={{ fontSize: 12, color: "#aaa", marginBottom: 12 }}>
        Showing <strong style={{ color: M }}>{filtered.length}</strong> student{filtered.length !== 1 ? "s" : ""}
        {filterCls !== "All" ? ` in ${filterCls}` : ""}{search ? ` matching "${search}"` : ""}
      </div>

      {/* Student list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(s => {
          const attPct = Math.round(s.attendance.present / s.attendance.total * 100);
          const feePending = s.feeStatus.some(f => f.status !== "Paid");
          const latestTerm = Object.keys(s.results).at(-1);
          const termMarks  = s.results[latestTerm];
          const avgMarks   = Math.round(termMarks.reduce((a, r) => a + r.marks, 0) / termMarks.reduce((a, r) => a + r.max, 0) * 100);

          return (
            <div key={s.id} onClick={() => setSelected(s)}
              style={{ background: MC, borderRadius: 14, padding: "14px 16px", border: `1.5px solid ${M}12`, cursor: "pointer", transition: "transform .15s, box-shadow .15s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 6px 20px ${M}18`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                {/* Avatar */}
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: `${M}12`, display: "grid", placeItems: "center", fontSize: 26, border: `2px solid ${M}20`, flexShrink: 0 }}>
                  {s.photo}
                </div>
                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#222" }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{s.cls} · Roll {s.roll} · {s.admNo}</div>
                    </div>
                    <span style={{ fontSize: 11, color: M, fontWeight: 700 }}>View Profile →</span>
                  </div>
                  {/* Quick chips */}
                  <div style={{ display: "flex", gap: 7, marginTop: 8, flexWrap: "wrap" }}>
                    <span style={{ padding: "2px 9px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: attPct >= 85 ? "#E8F5E9" : "#FFEBEE", color: attPct >= 85 ? GREEN : RED }}>
                      📅 {attPct}% Att.
                    </span>
                    <span style={{ padding: "2px 9px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: "#E3F2FD", color: BLUE }}>
                      📊 Avg {avgMarks}%
                    </span>
                    <span style={{ padding: "2px 9px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: feePending ? "#FFF3E0" : "#E8F5E9", color: feePending ? ORANGE : GREEN }}>
                      💰 {feePending ? "Fee Due" : "All Paid"}
                    </span>
                    <span style={{ padding: "2px 9px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: `${M}10`, color: M }}>
                      🏅 Rank #{s.rank}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#ccc" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 14 }}>No students found matching your search.</div>
          </div>
        )}
      </div>
    </div>
  );
}

function StudentProfile({ student: s, onBack }) {
  const [activeTab, setActiveTab] = useState("personal");
  const [activeTerm, setActiveTerm] = useState(Object.keys(s.results).at(-1));

  const attPct      = Math.round(s.attendance.present / s.attendance.total * 100);
  const termMarks   = s.results[activeTerm];
  const totalMarks  = termMarks.reduce((a, r) => a + r.marks, 0);
  const totalMax    = termMarks.reduce((a, r) => a + r.max, 0);
  const avgPct      = Math.round(totalMarks / totalMax * 100);
  const feePaid     = s.feeStatus.reduce((a, f) => a + f.paid, 0);
  const feePending  = s.feeStatus.reduce((a, f) => a + (f.amount - f.paid), 0);

  const grade = p => p >= 90 ? { g: "A+", color: "#1B5E20" } : p >= 80 ? { g: "A", color: GREEN }
    : p >= 70 ? { g: "B+", color: TEAL } : p >= 60 ? { g: "B", color: BLUE }
    : p >= 50 ? { g: "C", color: ORANGE } : { g: "D", color: RED };

  const conductColor = c => c === "Excellent" ? GREEN : c === "Good" ? BLUE : c === "Average" ? ORANGE : RED;

  const tabs = [
    { id: "personal",   label: "Personal",   icon: "👤" },
    { id: "family",     label: "Family",     icon: "👨‍👩‍👧" },
    { id: "attendance", label: "Attendance", icon: "📅" },
    { id: "fees",       label: "Fees",       icon: "💰" },
    { id: "results",    label: "Results",    icon: "📊" },
  ];

  const InfoRow = ({ label, value, color }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid #f5ede3" }}>
      <span style={{ fontSize: 12, color: "#888", minWidth: 130 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: color || "#222", textAlign: "right" }}>{value}</span>
    </div>
  );

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Back button */}
      <button onClick={onBack}
        style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, padding: "8px 16px", borderRadius: 10, border: `1.5px solid ${M}25`, background: "transparent", color: M, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
        ← Back to All Students
      </button>

      {/* Profile Hero Card */}
      <div style={{ background: `linear-gradient(135deg, ${MD} 0%, ${M} 60%, #A03030 100%)`, borderRadius: 18, padding: "20px 22px", marginBottom: 20, boxShadow: `0 8px 32px ${M}44` }}>
        <div style={{ display: "flex", gap: 18, alignItems: "center", marginBottom: 16 }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "grid", placeItems: "center", fontSize: 38, border: "3px solid rgba(255,255,255,0.4)", flexShrink: 0 }}>
            {s.photo}
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", fontFamily: "Georgia,serif" }}>{s.name}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", marginTop: 3 }}>{s.cls} · Section {s.section} · Roll No. {s.roll}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 2 }}>Adm No: {s.admNo}</div>
          </div>
        </div>
        {/* Quick stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
          {[
            ["📅", `${attPct}%`, "Attendance"],
            ["📊", `${avgPct}%`, "Avg Marks"],
            ["🏅", `#${s.rank}`, "Class Rank"],
            ["💰", feePending > 0 ? `₹${(feePending/1000).toFixed(0)}K Due` : "All Clear", "Fee Status"],
          ].map(([ic, v, l]) => (
            <div key={l} style={{ padding: "8px 6px", borderRadius: 10, background: "rgba(255,255,255,0.12)", textAlign: "center" }}>
              <div style={{ fontSize: 14 }}>{ic}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", marginTop: 2 }}>{v}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.55)", marginTop: 1 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Conduct + House badges */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
        <div style={{ flex: 1, padding: "12px 16px", borderRadius: 12, background: MC, border: `1px solid ${conductColor(s.conduct)}20`, textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Conduct</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: conductColor(s.conduct) }}>{s.conduct}</div>
        </div>
        <div style={{ flex: 1, padding: "12px 16px", borderRadius: 12, background: MC, border: `1px solid ${M}12`, textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>House</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: M }}>{s.house}</div>
        </div>
        <div style={{ flex: 1, padding: "12px 16px", borderRadius: 12, background: MC, border: `1px solid ${M}12`, textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Blood Group</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: RED }}>{s.blood}</div>
        </div>
        <div style={{ flex: 1, padding: "12px 16px", borderRadius: 12, background: MC, border: `1px solid ${M}12`, textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Rank</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: PURPLE }}>#{s.rank} / {s.totalStudents}</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 18, background: "#f0e8df", borderRadius: 12, padding: 5 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "8px 4px", borderRadius: 9, border: "none", background: activeTab === t.id ? "#fff" : "transparent", color: activeTab === t.id ? M : "#999", cursor: "pointer", fontSize: 9, fontWeight: 700, boxShadow: activeTab === t.id ? `0 2px 8px ${M}22` : "none", transition: "all .2s" }}>
            <span style={{ fontSize: 16 }}>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {/* ── PERSONAL TAB ── */}
      {activeTab === "personal" && (
        <div style={{ background: MC, borderRadius: 16, padding: "16px 18px", border: `1px solid ${M}12` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>🪪 Personal Information</div>
          <InfoRow label="Full Name"          value={s.name} />
          <InfoRow label="Date of Birth"      value={s.dob} />
          <InfoRow label="Gender"             value={s.gender} />
          <InfoRow label="Blood Group"        value={s.blood} color={RED} />
          <InfoRow label="Nationality"        value={s.nationality} />
          <InfoRow label="Religion"           value={s.religion} />
          <InfoRow label="Category"           value={s.category} />
          <InfoRow label="Admission No."      value={s.admNo} color={M} />
          <InfoRow label="Class & Section"    value={`${s.cls} – ${s.section}`} />
          <InfoRow label="Roll Number"        value={s.roll} />
          <InfoRow label="House"              value={s.house} />

          <div style={{ height: 1, background: "#f0e8df", margin: "14px 0" }} />
          <div style={{ fontSize: 11, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>🏠 Address</div>
          <div style={{ padding: "12px 14px", borderRadius: 10, background: "#FAFAF8", border: "1px solid #f0e8df", lineHeight: 1.7, fontSize: 13, color: "#444" }}>
            {s.address.line1}<br />{s.address.line2}<br />{s.address.city}, {s.address.state} – {s.address.pin}
          </div>

          <div style={{ height: 1, background: "#f0e8df", margin: "14px 0" }} />
          <div style={{ fontSize: 11, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>🚌 Transport</div>
          <InfoRow label="Bus Route"   value={s.busRoute} />
          <InfoRow label="Bus Stop"    value={s.busStop} />

          <div style={{ height: 1, background: "#f0e8df", margin: "14px 0" }} />
          <div style={{ fontSize: 11, fontWeight: 700, color: RED, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>🏥 Medical Information</div>
          <InfoRow label="Allergies"       value={s.medicalInfo.allergies} />
          <InfoRow label="Health Conditions" value={s.medicalInfo.conditions} />
          <InfoRow label="Family Doctor"   value={s.medicalInfo.doctorName} />
          <InfoRow label="Doctor Phone"    value={s.medicalInfo.doctorPhone} />
        </div>
      )}

      {/* ── FAMILY TAB ── */}
      {activeTab === "family" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { role: "Father", data: s.father, icon: "👨", color: BLUE   },
            { role: "Mother", data: s.mother, icon: "👩", color: PURPLE },
            { role: "Guardian", data: { ...s.guardian, email: s.father.email }, icon: "🧑", color: M },
          ].map(p => (
            <div key={p.role} style={{ background: MC, borderRadius: 16, padding: "16px 18px", border: `1px solid ${p.color}15` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: `${p.color}15`, display: "grid", placeItems: "center", fontSize: 20 }}>{p.icon}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#222" }}>{p.data.name}</div>
                  <div style={{ fontSize: 11, color: p.color, fontWeight: 600 }}>{p.role}{p.data.relation ? ` (${p.data.relation})` : ""}</div>
                </div>
              </div>
              <InfoRow label="Occupation"    value={p.data.occ || "–"} />
              <InfoRow label="Phone"         value={p.data.phone} color={GREEN} />
              {p.data.email && <InfoRow label="Email" value={p.data.email} color={BLUE} />}
              <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                <a href={`tel:${p.data.phone}`}
                  style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px", borderRadius: 9, background: "#E3F2FD", color: BLUE, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
                  📞 Call
                </a>
                <a href={`https://wa.me/91${p.data.phone.replace(/[^0-9]/g,"")}`} target="_blank" rel="noreferrer"
                  style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px", borderRadius: 9, background: "#E8F5E9", color: GREEN, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
                  💬 WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── ATTENDANCE TAB ── */}
      {activeTab === "attendance" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Summary */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
            {[
              ["Present",  s.attendance.present, GREEN],
              ["Absent",   s.attendance.total - s.attendance.present, RED],
              ["Rate",     `${attPct}%`, attPct >= 85 ? GREEN : attPct >= 75 ? ORANGE : RED],
            ].map(([l,v,c]) => (
              <div key={l} style={{ background: MC, borderRadius: 13, padding: "14px 10px", textAlign: "center", border: `1px solid ${c}18` }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: c }}>{v}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: c, textTransform: "uppercase", letterSpacing: 0.8, marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
          {/* Month-wise */}
          <div style={{ background: MC, borderRadius: 16, padding: "16px 18px", border: `1px solid ${M}12` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>Month-wise Attendance</div>
            {s.attendance.byMonth.map((m, i) => {
              const pct = Math.round(m.p / m.t * 100);
              return (
                <div key={m.m} style={{ marginBottom: i < s.attendance.byMonth.length - 1 ? 12 : 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#333", minWidth: 36 }}>{m.m}</span>
                    <span style={{ fontSize: 11, color: "#888" }}>{m.p}/{m.t} days</span>
                    <span style={{ fontSize: 11, fontWeight: 800, color: pct >= 90 ? GREEN : pct >= 80 ? TEAL : ORANGE, minWidth: 38, textAlign: "right" }}>{pct}%</span>
                  </div>
                  <div style={{ background: "#f0e8df", borderRadius: 5, height: 7 }}>
                    <div style={{ width: `${pct}%`, height: "100%", borderRadius: 5, background: pct >= 90 ? GREEN : pct >= 80 ? TEAL : ORANGE, transition: "width 1s ease" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── FEES TAB ── */}
      {activeTab === "fees" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Summary */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
            {[
              ["Total Fees",    `₹${s.feeStatus.reduce((a,f)=>a+f.amount,0).toLocaleString()}`, M     ],
              ["Paid",          `₹${feePaid.toLocaleString()}`,                                 GREEN ],
              ["Pending",       `₹${feePending.toLocaleString()}`,                              feePending > 0 ? RED : GREEN],
            ].map(([l,v,c]) => (
              <div key={l} style={{ background: MC, borderRadius: 13, padding: "14px 10px", textAlign: "center", border: `1px solid ${c}18` }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: c }}>{v}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: c, textTransform: "uppercase", letterSpacing: 0.8, marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
          {/* Term-wise */}
          <div style={{ background: MC, borderRadius: 16, padding: "16px 18px", border: `1px solid ${M}12` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>Term-wise Fee Statement</div>
            {s.feeStatus.map((f, i) => {
              const sc = f.status === "Paid" ? GREEN : f.status === "Overdue" ? RED : ORANGE;
              const sb = f.status === "Paid" ? "#E8F5E9" : f.status === "Overdue" ? "#FFEBEE" : "#FFF3E0";
              return (
                <div key={f.term} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: i < s.feeStatus.length - 1 ? "1px solid #f0e8df" : "none" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#222" }}>{f.term}</div>
                    <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{f.status === "Paid" ? `Paid on ${f.date}` : "Payment pending"}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 16, fontWeight: 900, color: sc }}>₹{f.amount.toLocaleString()}</div>
                    <span style={{ padding: "2px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: sb, color: sc }}>{f.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── RESULTS TAB ── */}
      {activeTab === "results" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Term selector */}
          <div style={{ display: "flex", gap: 8 }}>
            {Object.keys(s.results).map(t => (
              <button key={t} onClick={() => setActiveTerm(t)}
                style={{ flex: 1, padding: "9px", borderRadius: 10, border: `2px solid ${activeTerm === t ? M : "#e0d6cc"}`, background: activeTerm === t ? M : "transparent", color: activeTerm === t ? "#fff" : "#555", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                {t}
              </button>
            ))}
          </div>
          {/* Summary */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
            {[
              ["Total",   `${totalMarks}/${totalMax}`, M                              ],
              ["Average", `${avgPct}%`,                grade(avgPct).color            ],
              ["Grade",   grade(avgPct).g,             grade(avgPct).color            ],
            ].map(([l,v,c]) => (
              <div key={l} style={{ background: MC, borderRadius: 13, padding: "14px 10px", textAlign: "center", border: `1px solid ${c}18` }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: c, fontFamily: "Georgia,serif" }}>{v}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: c, textTransform: "uppercase", letterSpacing: 0.8, marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
          {/* Subjects */}
          <div style={{ background: MC, borderRadius: 16, padding: "16px 18px", border: `1px solid ${M}12` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>Subject-wise Marks</div>
            {termMarks.map((sub, i) => {
              const pct = Math.round(sub.marks / sub.max * 100);
              const g   = grade(pct);
              return (
                <div key={sub.sub} style={{ marginBottom: i < termMarks.length - 1 ? 14 : 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#222" }}>{sub.sub}</span>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: "#333" }}>{sub.marks}<span style={{ fontWeight: 400, color: "#aaa", fontSize: 11 }}>/{sub.max}</span></span>
                      <span style={{ padding: "2px 9px", borderRadius: 20, background: `${g.color}15`, color: g.color, fontSize: 10, fontWeight: 700 }}>{g.g}</span>
                    </div>
                  </div>
                  <div style={{ background: "#f0e8df", borderRadius: 5, height: 7 }}>
                    <div style={{ width: `${pct}%`, height: "100%", borderRadius: 5, background: g.color, transition: "width 1s ease" }} />
                  </div>
                  {i < termMarks.length - 1 && <div style={{ height: 1, background: "#f5ede3", marginTop: 12 }} />}
                </div>
              );
            })}
          </div>
          {/* Teacher remark */}
          <div style={{ background: `${M}08`, borderRadius: 14, padding: "14px 16px", border: `1px solid ${M}20` }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>👩‍🏫 Class Teacher's Remark</div>
            <div style={{ fontSize: 13, color: "#444", lineHeight: 1.6, fontStyle: "italic" }}>"{s.teacherRemark}"</div>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminRequirements() {
  const CATEGORIES = ["All", "Repair", "New Purchase", "Maintenance", "Stationery", "IT & Electronics", "Furniture", "Other"];
  const PRIORITIES  = ["High", "Medium", "Low"];
  const STATUSES    = ["Pending", "Approved", "In Progress", "Completed"];

  const priorityStyle = p => p === "High"   ? { color: RED,    bg: "#FFEBEE", dot: RED    }
                           : p === "Medium" ? { color: ORANGE, bg: "#FFF3E0", dot: ORANGE }
                           :                  { color: TEAL,   bg: "#E0F2F1", dot: TEAL   };

  const statusStyle = s => s === "Pending"     ? { color: ORANGE, bg: "#FFF3E0" }
                         : s === "Approved"    ? { color: BLUE,   bg: "#E3F2FD" }
                         : s === "In Progress" ? { color: PURPLE, bg: "#F3E5F5" }
                         :                       { color: GREEN,  bg: "#E8F5E9" };

  const [requests, setRequests] = useState([
    { id: 1,  title: "Blackboard Replacement",      desc: "Class 3 blackboard is cracked and difficult to write on.",        category: "Repair",           priority: "High",   status: "Pending",     by: "Mrs. Priya Nair",    dept: "Class 3",   date: "Mar 8" },
    { id: 2,  title: "New Printer for Office",       desc: "The existing printer is frequently jamming. Need a new one.",      category: "IT & Electronics", priority: "High",   status: "Approved",    by: "Mr. Ramesh Kumar",   dept: "Admin",     date: "Mar 6" },
    { id: 3,  title: "Whiteboard Markers (×50)",     desc: "Running out of markers across all classrooms.",                   category: "Stationery",       priority: "Medium", status: "Completed",   by: "Mrs. Sunita Patel",  dept: "Staff Room",date: "Mar 4" },
    { id: 4,  title: "Repair Ceiling Fan – Class 5", desc: "One fan is not working since last week. Students uncomfortable.", category: "Repair",           priority: "High",   status: "In Progress", by: "Mr. Suresh Iyer",    dept: "Class 5",   date: "Mar 7" },
    { id: 5,  title: "New Chairs for Library",       desc: "Library needs 20 additional chairs for reading sessions.",        category: "Furniture",        priority: "Medium", status: "Pending",     by: "Ms. Anita Mehta",    dept: "Library",   date: "Mar 5" },
    { id: 6,  title: "Projector Bulb Replacement",   desc: "Projector in the computer lab has a dead bulb.",                  category: "IT & Electronics", priority: "Medium", status: "Approved",    by: "Mr. Vivek Sharma",   dept: "Comp Lab",  date: "Mar 3" },
    { id: 7,  title: "Paint Walls – Ground Floor",   desc: "Ground floor corridor walls are peeling and look worn out.",      category: "Maintenance",      priority: "Low",    status: "Pending",     by: "Mr. Ramesh Kumar",   dept: "Admin",     date: "Feb 28" },
    { id: 8,  title: "A4 Paper Restock (10 Reams)",  desc: "Office paper stock will finish by end of week.",                 category: "Stationery",       priority: "Medium", status: "Pending",     by: "Mrs. Sunita Patel",  dept: "Admin",     date: "Mar 9" },
    { id: 9,  title: "Repair Broken Bench – Class 2",desc: "One wooden bench has a broken leg. Safety concern.",             category: "Furniture",        priority: "High",   status: "In Progress", by: "Mrs. Geeta Singh",   dept: "Class 2",   date: "Mar 9" },
    { id: 10, title: "New Dustbins for Classrooms",  desc: "Each classroom needs 1 dustbin. Currently none available.",      category: "Other",            priority: "Low",    status: "Pending",     by: "Mr. Suresh Iyer",    dept: "Class 5",   date: "Mar 1" },
  ]);

  const [filterCat,    setFilterCat]    = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy,       setSortBy]       = useState("date");
  const [sheetOpen,    setSheetOpen]    = useState(false);
  const [detailItem,   setDetailItem]   = useState(null);
  const [form, setForm] = useState({ title: "", desc: "", category: "Repair", priority: "Medium", by: "", dept: "" });

  const filtered = requests
    .filter(r => filterCat    === "All" || r.category === filterCat)
    .filter(r => filterStatus === "All" || r.status   === filterStatus)
    .sort((a, b) => sortBy === "priority"
      ? PRIORITIES.indexOf(a.priority) - PRIORITIES.indexOf(b.priority)
      : STATUSES.indexOf(a.status)    - STATUSES.indexOf(b.status));

  const counts = {
    total:      requests.length,
    pending:    requests.filter(r => r.status === "Pending").length,
    inProgress: requests.filter(r => r.status === "In Progress").length,
    high:       requests.filter(r => r.priority === "High" && r.status === "Pending").length,
  };

  const addRequest = () => {
    if (!form.title.trim() || !form.by.trim()) return;
    setRequests(prev => [{
      id: Date.now(), ...form,
      status: "Pending",
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    }, ...prev]);
    setForm({ title: "", desc: "", category: "Repair", priority: "Medium", by: "", dept: "" });
    setSheetOpen(false);
  };

  const updateStatus = (id, status) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    if (detailItem?.id === id) setDetailItem(prev => ({ ...prev, status }));
  };

  /* ── DETAIL SHEET ── */
  if (detailItem) {
    const r = requests.find(x => x.id === detailItem.id) || detailItem;
    const ps = priorityStyle(r.priority);
    const ss = statusStyle(r.status);
    return (
      <div>
        <button onClick={() => setDetailItem(null)}
          style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, padding: "8px 16px", borderRadius: 10, border: `1.5px solid ${M}25`, background: "transparent", color: M, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          ← Back to All Requests
        </button>

        <div style={{ background: MC, borderRadius: 16, padding: "18px 20px", border: `1px solid ${M}12`, marginBottom: 14 }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div style={{ flex: 1, marginRight: 12 }}>
              <div style={{ fontSize: 17, fontWeight: 800, color: "#222", marginBottom: 6, lineHeight: 1.3 }}>{r.title}</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span style={{ padding: "3px 10px", borderRadius: 20, background: ps.bg, color: ps.color, fontSize: 11, fontWeight: 700 }}>
                  <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: ps.dot, marginRight: 4 }} />{r.priority} Priority
                </span>
                <span style={{ padding: "3px 10px", borderRadius: 20, background: ss.bg, color: ss.color, fontSize: 11, fontWeight: 700 }}>{r.status}</span>
                <span style={{ padding: "3px 10px", borderRadius: 20, background: `${M}12`, color: M, fontSize: 11, fontWeight: 600 }}>{r.category}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div style={{ padding: "12px 14px", borderRadius: 10, background: "#FAFAF8", border: "1px solid #f0e8df", marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Description</div>
            <div style={{ fontSize: 13, color: "#444", lineHeight: 1.6 }}>{r.desc}</div>
          </div>

          {/* Meta grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            {[
              ["👩‍🏫 Raised By", r.by],
              ["🏫 Department", r.dept],
              ["📅 Date", r.date],
              ["📂 Category", r.category],
            ].map(([l, v]) => (
              <div key={l} style={{ padding: "10px 12px", borderRadius: 10, background: `${M}06`, border: `1px solid ${M}12` }}>
                <div style={{ fontSize: 10, color: "#aaa", marginBottom: 3 }}>{l}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Status update */}
          <div style={{ marginBottom: 4 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Update Status</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {STATUSES.map(s => {
                const st = statusStyle(s);
                const isActive = r.status === s;
                return (
                  <button key={s} onClick={() => updateStatus(r.id, s)}
                    style={{ padding: "10px 12px", borderRadius: 10, border: `2px solid ${isActive ? st.color : st.color + "40"}`, background: isActive ? st.bg : "transparent", color: st.color, fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: st.color, flexShrink: 0 }} />{s}
                    {isActive && <span style={{ marginLeft: "auto", fontSize: 14 }}>✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 32 }}>

      {/* ── HEADER ── */}
      <div style={{ background: `linear-gradient(135deg, ${MD} 0%, ${M} 60%, #A03030 100%)`, borderRadius: 16, padding: "16px 20px", marginBottom: 18, boxShadow: `0 8px 32px ${M}44` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", fontFamily: "Georgia,serif", marginBottom: 2 }}>🔧 Requirements Board</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>Staff & teacher requests — reviewed by Chairman</div>
          </div>
          <button onClick={() => setSheetOpen(true)}
            style={{ padding: "9px 16px", borderRadius: 10, border: "none", background: "#fff", color: M, fontSize: 12, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>
            + New Request
          </button>
        </div>
        {/* Quick KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginTop: 14 }}>
          {[
            ["📋", counts.total,      "Total",       "rgba(255,255,255,0.15)"],
            ["⏳", counts.pending,    "Pending",     "#FFF3E020"],
            ["⚙️",  counts.inProgress,"In Progress", "#E3F2FD20"],
            ["🔴", counts.high,       "High Priority","#FFEBEE20"],
          ].map(([ic, n, l, bg]) => (
            <div key={l} style={{ padding: "8px 6px", borderRadius: 10, background: bg, textAlign: "center", border: "1px solid rgba(255,255,255,0.12)" }}>
              <div style={{ fontSize: 14 }}>{ic}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>{n}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.6)", marginTop: 1 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FILTERS ── */}
      <div style={{ background: MC, borderRadius: 14, padding: "14px 16px", marginBottom: 14, border: `1px solid ${M}12` }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Filter & Sort</div>
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: "#888", marginBottom: 6 }}>By Category</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setFilterCat(c)}
                style={{ padding: "5px 12px", borderRadius: 20, border: "none", background: filterCat === c ? M : "#eee", color: filterCat === c ? "#fff" : "#555", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ fontSize: 11, color: "#888", marginBottom: 6 }}>By Status</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["All", ...STATUSES].map(s => {
                const st = s === "All" ? { color: M, bg: `${M}15` } : statusStyle(s);
                return (
                  <button key={s} onClick={() => setFilterStatus(s)}
                    style={{ padding: "5px 12px", borderRadius: 20, border: "none", background: filterStatus === s ? (s === "All" ? M : st.color) : "#eee", color: filterStatus === s ? "#fff" : "#555", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: "#888", marginBottom: 6 }}>Sort By</div>
            <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", border: `1.5px solid ${M}25` }}>
              {[["date","Date"],["priority","Priority"],["status","Status"]].map(([v,l]) => (
                <button key={v} onClick={() => setSortBy(v)}
                  style={{ padding: "5px 12px", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, background: sortBy === v ? M : "transparent", color: sortBy === v ? "#fff" : "#888" }}>{l}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── REQUESTS LIST ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "32px", color: "#ccc", fontSize: 13 }}>No requests match the selected filters.</div>
        )}
        {filtered.map(r => {
          const ps = priorityStyle(r.priority);
          const ss = statusStyle(r.status);
          return (
            <div key={r.id} onClick={() => setDetailItem(r)}
              style={{ background: MC, borderRadius: 14, padding: "14px 16px", border: `1.5px solid ${r.priority === "High" && r.status === "Pending" ? RED + "30" : M + "12"}`, cursor: "pointer", transition: "transform .15s, box-shadow .15s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 6px 20px ${M}15`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)";   e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  {/* Title row */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: ps.dot, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#222" }}>{r.title}</span>
                  </div>
                  {/* Desc */}
                  <div style={{ fontSize: 11, color: "#888", marginBottom: 8, marginLeft: 16, lineHeight: 1.4 }}>{r.desc.length > 80 ? r.desc.slice(0, 80) + "…" : r.desc}</div>
                  {/* Meta chips */}
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginLeft: 16 }}>
                    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: `${M}10`, color: M, fontWeight: 600 }}>📂 {r.category}</span>
                    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: "#f5f5f5", color: "#666" }}>👤 {r.by}</span>
                    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: "#f5f5f5", color: "#666" }}>🏫 {r.dept}</span>
                    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: "#f5f5f5", color: "#aaa" }}>📅 {r.date}</span>
                  </div>
                </div>
                {/* Right side badges */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                  <span style={{ padding: "3px 10px", borderRadius: 20, background: ps.bg, color: ps.color, fontSize: 10, fontWeight: 700 }}>{r.priority}</span>
                  <span style={{ padding: "3px 10px", borderRadius: 20, background: ss.bg, color: ss.color, fontSize: 10, fontWeight: 700 }}>{r.status}</span>
                  <span style={{ fontSize: 11, color: M, fontWeight: 600, marginTop: 2 }}>View →</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── ADD NEW REQUEST SHEET ── */}
      <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="New Requirement Request">
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>Title</div>
          <input placeholder="e.g. New Blackboard for Class 4" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={cardInput} />
        </div>
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>Description</div>
          <textarea placeholder="Describe the requirement in detail..." rows={3} value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} style={{ ...cardInput, resize: "none", lineHeight: 1.5 }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>Category</div>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ ...cardInput, marginBottom: 0 }}>
              {CATEGORIES.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>Priority</div>
            <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))} style={{ ...cardInput, marginBottom: 0 }}>
              {PRIORITIES.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>Raised By</div>
            <input placeholder="Teacher / Staff name" value={form.by} onChange={e => setForm(f => ({ ...f, by: e.target.value }))} style={{ ...cardInput, marginBottom: 0 }} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>Department</div>
            <input placeholder="e.g. Class 3, Admin" value={form.dept} onChange={e => setForm(f => ({ ...f, dept: e.target.value }))} style={{ ...cardInput, marginBottom: 0 }} />
          </div>
        </div>
        <button onClick={addRequest}
          disabled={!form.title.trim() || !form.by.trim()}
          style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: (!form.title.trim() || !form.by.trim()) ? "#ddd" : `linear-gradient(135deg,${M},${MD})`, color: (!form.title.trim() || !form.by.trim()) ? "#aaa" : "#fff", fontSize: 14, fontWeight: 700, cursor: (!form.title.trim() || !form.by.trim()) ? "not-allowed" : "pointer", boxShadow: (!form.title.trim() || !form.by.trim()) ? "none" : `0 4px 16px ${M}44` }}>
          Submit Request →
        </button>
      </Sheet>

    </div>
  );
}

// ═══════════════════════════════════════════
//  ADMINISTRATION PORTAL — ALL PAGES
// ═══════════════════════════════════════════

function AdmDashboard({ subRole, setTab }) {
  const roleInfo = {
    principal:   { name: "Dr. Meena Joshi",   title: "Principal",        icon: "🎓", color: M     },
    accounts:    { name: "Mr. Rakesh Gupta",  title: "Accounts Officer", icon: "💰", color: GREEN },
    coordinator: { name: "Mrs. Sunita Verma", title: "Coordinator",      icon: "📋", color: BLUE  },
  };
  const info = roleInfo[subRole] || roleInfo.principal;

  const kpis = {
    principal: [
      { icon: "🎓", val: "393",  label: "Total Students",  sub: "8 classes",        color: M      },
      { icon: "✅", val: "91%",  label: "Attendance Today", sub: "359 present",      color: GREEN  },
      { icon: "⚠️", val: "34",  label: "Fee Defaulters",  sub: "₹4.9L pending",    color: RED    },
      { icon: "👨‍💼", val: "43/48",label: "Staff Present",   sub: "5 absent today",  color: BLUE   },
      { icon: "📝", val: "6",    label: "Exams This Month", sub: "Next: March 15",   color: PURPLE },
      { icon: "🔧", val: "3",    label: "Pending Requests", sub: "High priority",    color: ORANGE },
    ],
    accounts: [
      { icon: "💰", val: "₹4.9L", label: "Fee Pending",    sub: "34 defaulters",    color: RED    },
      { icon: "✅", val: "₹12.4L",label: "Collected",      sub: "Term 3 so far",    color: GREEN  },
      { icon: "📊", val: "73%",   label: "Collection Rate", sub: "vs 68% last term", color: M      },
      { icon: "⚠️", val: "12",   label: "Overdue >30 days",sub: "Needs follow-up",  color: ORANGE },
    ],
    coordinator: [
      { icon: "✅", val: "91%",  label: "Attendance Today", sub: "359 / 393 students",color: GREEN  },
      { icon: "📝", val: "6",    label: "Upcoming Exams",  sub: "This month",         color: M      },
      { icon: "📢", val: "3",    label: "Active Notices",  sub: "Posted this week",   color: BLUE   },
      { icon: "📈", val: "12",   label: "New Admissions",  sub: "This month",         color: PURPLE },
    ],
  };

  const quickLinks = {
    principal:   [["⚠️","Fee Defaulters","adm-defaulters"],["📅","Attendance","adm-attendance"],["📝","Exams","adm-exams"],["📢","Notices","adm-notices"]],
    accounts:    [["💰","Fee Details","adm-fees"],["📢","Notices","adm-notices"],["🔧","Requirements","adm-requirements"]],
    coordinator: [["📅","Attendance","adm-attendance"],["📝","Exams","adm-exams"],["📈","Admissions","adm-admissions"],["📢","Notices","adm-notices"]],
  };

  const recentActivity = [
    { icon: "💰", text: "Fee collected from Rohan Mehta – Class 4",  time: "10 min ago", color: GREEN  },
    { icon: "📅", text: "3 students marked absent – Class 2",         time: "25 min ago", color: ORANGE },
    { icon: "📢", text: "PTM Notice posted by Coordinator",           time: "1 hr ago",   color: BLUE   },
    { icon: "🔧", text: "New request: Ceiling Fan – Class 5",         time: "2 hrs ago",  color: RED    },
    { icon: "📝", text: "Unit Test schedule published for Class 3–5", time: "3 hrs ago",  color: PURPLE },
  ];

  return (
    <div style={{ paddingBottom: 32 }}>
      {/* Welcome header */}
      <div style={{ background: `linear-gradient(135deg, ${MD} 0%, ${info.color === M ? M : info.color} 60%, ${info.color}cc 100%)`, borderRadius: 18, padding: "18px 22px", marginBottom: 20, boxShadow: `0 8px 32px ${info.color}44` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
          <div style={{ width: 54, height: 54, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "grid", placeItems: "center", fontSize: 28, border: "2px solid rgba(255,255,255,0.35)" }}>{info.icon}</div>
          <div>
            <div style={{ fontSize: 19, fontWeight: 800, color: "#fff", fontFamily: "Georgia,serif" }}>Welcome, {info.name}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>{info.title} · G.L. International School</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", marginTop: 1 }}>{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</div>
          </div>
        </div>
        {/* Quick action buttons */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {(quickLinks[subRole] || quickLinks.principal).map(([ic, label, target]) => (
            <button key={target} onClick={() => setTab(target)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 20, border: "none", background: "rgba(255,255,255,0.18)", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              <span>{ic}</span>{label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12, marginBottom: 20 }}>
        {(kpis[subRole] || kpis.principal).map(k => (
          <div key={k.label} style={{ background: MC, borderRadius: 14, padding: "14px 14px", border: `1px solid ${k.color}18`, textAlign: "center" }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{k.icon}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: k.color, fontFamily: "Georgia,serif" }}>{k.val}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: k.color, textTransform: "uppercase", letterSpacing: 0.8, marginTop: 4 }}>{k.label}</div>
            <div style={{ fontSize: 10, color: "#aaa", marginTop: 2 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div style={{ background: MC, borderRadius: 16, padding: "16px 18px", border: `1px solid ${M}12` }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>🕐 Recent Activity</div>
        {recentActivity.map((a, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 0", borderBottom: i < recentActivity.length - 1 ? "1px solid #f0e8df" : "none" }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: `${a.color}15`, display: "grid", placeItems: "center", fontSize: 16, flexShrink: 0 }}>{a.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#333" }}>{a.text}</div>
              <div style={{ fontSize: 10, color: "#aaa", marginTop: 2 }}>{a.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdmFees() {
  const classes = [
    { cls: "Nursery", total: 380000, collected: 342000, students: 45, defaulters: 3 },
    { cls: "LKG",     total: 440000, collected: 396000, students: 52, defaulters: 4 },
    { cls: "UKG",     total: 460000, collected: 391000, students: 55, defaulters: 6 },
    { cls: "Class 1", total: 780000, collected: 624000, students: 60, defaulters: 8 },
    { cls: "Class 2", total: 825000, collected: 693000, students: 58, defaulters: 7 },
    { cls: "Class 3", total: 870000, collected: 696000, students: 58, defaulters: 9 },
    { cls: "Class 4", total: 750000, collected: 637500, students: 55, defaulters: 5 },
    { cls: "Class 5", total: 720000, collected: 504000, students: 50, defaulters: 10 },
  ].map(r => ({ ...r, pct: Math.round(r.collected / r.total * 100), pending: r.total - r.collected }));

  const totalCollected = classes.reduce((a, c) => a + c.collected, 0);
  const totalPending   = classes.reduce((a, c) => a + c.pending,   0);
  const totalAmt       = classes.reduce((a, c) => a + c.total,     0);
  const overallPct     = Math.round(totalCollected / totalAmt * 100);

  const recentTxns = [
    { name: "Rohan Mehta",   cls: "Class 4", amount: 8500,  method: "UPI",  time: "10:32 AM", status: "Paid"    },
    { name: "Priya Sharma",  cls: "Class 2", amount: 12000, method: "Cash", time: "10:15 AM", status: "Paid"    },
    { name: "Arjun Patel",   cls: "Class 5", amount: 9500,  method: "UPI",  time: "9:50 AM",  status: "Paid"    },
    { name: "Sneha Gupta",   cls: "Class 3", amount: 7800,  method: "Card", time: "9:20 AM",  status: "Paid"    },
    { name: "Rahul Verma",   cls: "Class 1", amount: 11000, method: "–",    time: "Due Mar 15",status: "Pending" },
    { name: "Kavya Singh",   cls: "Class 3", amount: 8200,  method: "–",    time: "Due Mar 18",status: "Overdue" },
  ];

  return (
    <div style={{ paddingBottom: 32 }}>
      <div style={{ background: `linear-gradient(135deg, ${MD} 0%, ${GREEN} 100%)`, borderRadius: 16, padding: "16px 20px", marginBottom: 20, boxShadow: `0 8px 24px ${GREEN}44` }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", fontFamily: "Georgia,serif", marginBottom: 2 }}>💰 Fee Collection — Term 3</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginBottom: 14 }}>Academic Year 2024–25</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
          {[["Collected", `₹${(totalCollected/100000).toFixed(1)}L`, GREEN],["Pending", `₹${(totalPending/100000).toFixed(1)}L`, RED],["Overall", `${overallPct}%`, "#fff"]].map(([l,v,c]) => (
            <div key={l} style={{ padding: "10px", borderRadius: 12, background: "rgba(255,255,255,0.15)", textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>{v}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.65)", marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Class-wise table */}
      <div style={{ background: MC, borderRadius: 16, padding: "16px 18px", marginBottom: 16, border: `1px solid ${M}12` }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>Class-wise Collection</div>
        {classes.map((c, i) => (
          <div key={c.cls} style={{ marginBottom: i < classes.length - 1 ? 12 : 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#333", minWidth: 52 }}>{c.cls}</span>
                <span style={{ fontSize: 10, color: "#aaa" }}>{c.students} students</span>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 11, color: RED, fontWeight: 600 }}>₹{(c.pending/1000).toFixed(0)}K pending</span>
                <span style={{ fontSize: 11, fontWeight: 800, color: c.pct >= 90 ? GREEN : c.pct >= 75 ? TEAL : ORANGE }}>{c.pct}%</span>
              </div>
            </div>
            <div style={{ background: "#f0e8df", borderRadius: 5, height: 8 }}>
              <div style={{ width: `${c.pct}%`, height: "100%", borderRadius: 5, background: c.pct >= 90 ? GREEN : c.pct >= 75 ? TEAL : ORANGE, transition: "width 1s ease" }} />
            </div>
            {i < classes.length - 1 && <div style={{ height: 1, background: "#f0e8df", marginTop: 10 }} />}
          </div>
        ))}
      </div>

      {/* Recent Transactions */}
      <div style={{ background: MC, borderRadius: 16, padding: "16px 18px", border: `1px solid ${M}12` }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>Today's Transactions</div>
        {recentTxns.map((t, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < recentTxns.length - 1 ? "1px solid #f0e8df" : "none" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: t.status === "Paid" ? "#E8F5E9" : t.status === "Overdue" ? "#FFEBEE" : "#FFF3E0", display: "grid", placeItems: "center", fontSize: 16 }}>
                {t.status === "Paid" ? "✅" : t.status === "Overdue" ? "🔴" : "⏳"}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#222" }}>{t.name}</div>
                <div style={{ fontSize: 11, color: "#aaa" }}>{t.cls} · {t.method !== "–" ? t.method : t.time}</div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: t.status === "Paid" ? GREEN : t.status === "Overdue" ? RED : ORANGE }}>₹{t.amount.toLocaleString()}</div>
              <div style={{ fontSize: 10, color: t.status === "Paid" ? GREEN : t.status === "Overdue" ? RED : ORANGE, fontWeight: 600 }}>{t.status}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
//  TEACHER ATTENDANCE MANAGEMENT MODULE
// ═══════════════════════════════════════════

const CLASS_STUDENTS = [
  { id: 1,  name: "Aarav Sharma",    roll: 1,  phone: "9876543210", parent: "Mr. Rajesh Sharma",    photo: "🧒" },
  { id: 2,  name: "Aditi Verma",     roll: 2,  phone: "8765432109", parent: "Mrs. Sunita Verma",    photo: "👧" },
  { id: 3,  name: "Arjun Patel",     roll: 3,  phone: "7654321098", parent: "Mr. Dinesh Patel",     photo: "🧒" },
  { id: 4,  name: "Deepika Singh",   roll: 4,  phone: "6543210987", parent: "Mr. Vikram Singh",     photo: "👧" },
  { id: 5,  name: "Harsh Gupta",     roll: 5,  phone: "5432109876", parent: "Mrs. Neha Gupta",      photo: "🧒" },
  { id: 6,  name: "Ishaan Mehta",    roll: 6,  phone: "4321098765", parent: "Mr. Sunil Mehta",      photo: "🧒" },
  { id: 7,  name: "Kavya Nair",      roll: 7,  phone: "3210987654", parent: "Mrs. Priya Nair",      photo: "👧" },
  { id: 8,  name: "Manav Joshi",     roll: 8,  phone: "2109876543", parent: "Mr. Anil Joshi",       photo: "🧒" },
  { id: 9,  name: "Neha Sharma",     roll: 9,  phone: "1098765432", parent: "Mrs. Rita Sharma",     photo: "👧" },
  { id: 10, name: "Om Prakash",      roll: 10, phone: "9087654321", parent: "Mr. Ram Prakash",      photo: "🧒" },
  { id: 11, name: "Priya Agarwal",   roll: 11, phone: "8076543210", parent: "Mr. Mohan Agarwal",    photo: "👧" },
  { id: 12, name: "Rahul Kumar",     roll: 12, phone: "7065432109", parent: "Mrs. Sita Kumar",      photo: "🧒" },
  { id: 13, name: "Sakshi Yadav",    roll: 13, phone: "6054321098", parent: "Mr. Ravi Yadav",       photo: "👧" },
  { id: 14, name: "Tanmay Desai",    roll: 14, phone: "5043210987", parent: "Mrs. Pooja Desai",     photo: "🧒" },
  { id: 15, name: "Urvashi Shah",    roll: 15, phone: "4032109876", parent: "Mr. Kiran Shah",       photo: "👧" },
  { id: 16, name: "Vivaan Iyer",     roll: 16, phone: "3021098765", parent: "Mrs. Meena Iyer",      photo: "🧒" },
  { id: 17, name: "Yashika Pandey",  roll: 17, phone: "2010987654", parent: "Mr. Shiv Pandey",      photo: "👧" },
  { id: 18, name: "Zoya Khan",       roll: 18, phone: "1009876543", parent: "Mr. Imran Khan",       photo: "👧" },
];

const MASK_PHONE = p => p.slice(0,2) + "XXXXXXX" + p.slice(-2);
const TODAY_STR  = new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
const TODAY_KEY  = new Date().toISOString().slice(0,10);
const ATT_STORE  = "glis-att-" + TODAY_KEY;

function TeacherAttendance() {
  const [att,       setAtt]       = useState(() => Object.fromEntries(CLASS_STUDENTS.map(s=>[s.id,true])));
  const [submitted, setSubmitted] = useState(false);
  const [confirming,setConfirming]= useState(false);
  const [msgStatus, setMsgStatus] = useState({});
  const [history,   setHistory]   = useState([]);
  const [search,    setSearch]    = useState("");
  const [filter,    setFilter]    = useState("all");
  const [section,   setSection]   = useState("mark");
  const [sending,   setSending]   = useState(false);
  const [editMode,  setEditMode]  = useState(false);

  useEffect(()=>{
    (async()=>{
      try{ const r=await window.storage.get(ATT_STORE); if(r?.value){const d=JSON.parse(r.value);setAtt(d.att);setSubmitted(d.submitted);setMsgStatus(d.msgStatus||{});} }catch{}
      try{ const r=await window.storage.get("glis-att-hist"); if(r?.value) setHistory(JSON.parse(r.value)); }catch{}
    })();
  },[]);

  const absentList  = CLASS_STUDENTS.filter(s=>!att[s.id]);
  const presentCount= CLASS_STUDENTS.filter(s=> att[s.id]).length;
  const absentCount = absentList.length;

  const toggle = id => { if(submitted&&!editMode) return; setAtt(p=>({...p,[id]:!p[id]})); };
  const markAll= v  => { if(submitted&&!editMode) return; setAtt(Object.fromEntries(CLASS_STUDENTS.map(s=>[s.id,v]))); };

  const sendWA = async (student) => {
    setMsgStatus(p=>({...p,[student.id]:"sending"}));
    await new Promise(r=>setTimeout(r,500+Math.random()*900));
    const ok = Math.random()>0.07;
    setMsgStatus(p=>({...p,[student.id]:ok?"sent":"failed"}));
    return ok;
  };

  const doSubmit = async () => {
    setConfirming(false); setSending(true);
    setSubmitted(true); setEditMode(false);
    try{ await window.storage.set(ATT_STORE,JSON.stringify({att,submitted:true,msgStatus:{}})); }catch{}
    const results={};
    for(const s of absentList){ results[s.id]=await sendWA(s) ? "sent":"failed"; }
    setMsgStatus(results);
    try{ await window.storage.set(ATT_STORE,JSON.stringify({att,submitted:true,msgStatus:results})); }catch{}
    const rec={date:TODAY_STR,dateKey:TODAY_KEY,present:presentCount,absent:absentCount,total:CLASS_STUDENTS.length,
               absentees:absentList.map(s=>s.name),
               msgsSent:Object.values(results).filter(v=>v==="sent").length,
               msgsFailed:Object.values(results).filter(v=>v==="failed").length};
    const newHist=[rec,...history.slice(0,29)];
    setHistory(newHist);
    try{ await window.storage.set("glis-att-hist",JSON.stringify(newHist)); }catch{}
    setSending(false);
  };

  const sentCount    = Object.values(msgStatus).filter(v=>v==="sent").length;
  const failedCount  = Object.values(msgStatus).filter(v=>v==="failed").length;
  const sendingCount = Object.values(msgStatus).filter(v=>v==="sending").length;

  const displayed = CLASS_STUDENTS
    .filter(s=>s.name.toLowerCase().includes(search.toLowerCase())||String(s.roll).includes(search))
    .filter(s=>filter==="all"?true:filter==="present"?att[s.id]:!att[s.id]);

  return (
    <div style={{paddingBottom:40}}>

      {/* HEADER */}
      <div style={{background:`linear-gradient(135deg,#1A0A0A 0%,${MD} 40%,${M} 100%)`,borderRadius:20,padding:"18px 22px",marginBottom:20,boxShadow:`0 12px 40px ${M}55`,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-30,right:-30,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,0.04)",pointerEvents:"none"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
          <div>
            <div style={{fontSize:19,fontWeight:900,color:"#fff",fontFamily:"Georgia,serif"}}>📅 Attendance Manager</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.55)",marginTop:3}}>Class 3 – A · Mrs. Priya Nair</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginTop:2}}>{TODAY_STR}</div>
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"flex-end"}}>
            {submitted&&!editMode&&<div style={{padding:"5px 12px",borderRadius:20,background:"#1B5E20",border:"1px solid #2E7D32",fontSize:11,fontWeight:700,color:"#A5D6A7"}}>✅ Submitted</div>}
            {editMode&&<div style={{padding:"5px 12px",borderRadius:20,background:"#E65100",border:"1px solid #F57C00",fontSize:11,fontWeight:700,color:"#FFE0B2"}}>✏️ Editing</div>}
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
          {[["Total",CLASS_STUDENTS.length,"rgba(255,255,255,0.15)","#fff"],
            ["Present",presentCount,"#1B5E2099","#A5D6A7"],
            ["Absent",absentCount,"#B71C1C99","#FFCDD2"],
            ["Rate",Math.round(presentCount/CLASS_STUDENTS.length*100)+"%","rgba(255,255,255,0.1)","#FFF9C4"]
          ].map(([l,v,bg,c])=>(
            <div key={l} style={{padding:"10px 4px",borderRadius:12,background:bg,textAlign:"center",border:"1px solid rgba(255,255,255,0.07)"}}>
              <div style={{fontSize:18,fontWeight:900,color:c,fontFamily:"Georgia,serif"}}>{v}</div>
              <div style={{fontSize:9,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:1,marginTop:2}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TABS */}
      <div style={{display:"flex",gap:6,marginBottom:18,background:"#f0e8df",borderRadius:12,padding:5}}>
        {[["mark","📋 Mark Attendance"],["history","📊 History"]].map(([id,label])=>(
          <button key={id} onClick={()=>setSection(id)}
            style={{flex:1,padding:"9px 8px",borderRadius:9,border:"none",background:section===id?"#fff":"transparent",color:section===id?M:"#999",fontSize:12,fontWeight:700,cursor:"pointer",boxShadow:section===id?`0 2px 10px ${M}22`:"none",transition:"all .2s"}}>
            {label}
          </button>
        ))}
      </div>

      {section==="mark" && <>

        {/* WhatsApp status banner */}
        {submitted&&Object.keys(msgStatus).length>0&&(
          <div style={{borderRadius:14,padding:"14px 16px",marginBottom:16,background:failedCount>0?"#FFF3E0":"#E8F5E9",border:`1.5px solid ${failedCount>0?ORANGE:GREEN}40`}}>
            <div style={{fontSize:12,fontWeight:800,color:failedCount>0?ORANGE:GREEN,marginBottom:8,display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:18}}>💬</span> WhatsApp Notification Status
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {sendingCount>0&&<span style={{padding:"4px 12px",borderRadius:20,background:"#E3F2FD",color:BLUE,fontSize:11,fontWeight:700}}>⏳ Sending: {sendingCount}</span>}
              {sentCount>0&&<span style={{padding:"4px 12px",borderRadius:20,background:"#E8F5E9",color:GREEN,fontSize:11,fontWeight:700}}>✅ Sent: {sentCount}</span>}
              {failedCount>0&&<span style={{padding:"4px 12px",borderRadius:20,background:"#FFEBEE",color:RED,fontSize:11,fontWeight:700}}>❌ Failed: {failedCount}</span>}
              {absentCount===0&&<span style={{fontSize:12,color:GREEN,fontWeight:600}}>🎉 All present — no notifications needed!</span>}
            </div>
          </div>
        )}

        {/* Double-send lock notice */}
        {submitted&&!editMode&&(
          <div style={{display:"flex",gap:10,alignItems:"center",padding:"11px 14px",borderRadius:12,background:`${BLUE}08`,border:`1px solid ${BLUE}22`,marginBottom:16}}>
            <span style={{fontSize:18}}>🔒</span>
            <div style={{flex:1}}>
              <div style={{fontSize:12,fontWeight:700,color:BLUE}}>Attendance Locked — Already Submitted Today</div>
              <div style={{fontSize:11,color:"#888",marginTop:2}}>WhatsApp messages sent. Editing will NOT re-trigger notifications.</div>
            </div>
            <button onClick={()=>{setEditMode(true);setSubmitted(false);setMsgStatus({});}}
              style={{padding:"6px 14px",borderRadius:9,border:`1.5px solid ${ORANGE}40`,background:"transparent",color:ORANGE,fontSize:11,fontWeight:700,cursor:"pointer",flexShrink:0}}>
              ✏️ Edit
            </button>
          </div>
        )}

        {/* Controls */}
        <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
          <div style={{flex:1,minWidth:150,display:"flex",alignItems:"center",gap:8,background:MC,borderRadius:10,padding:"8px 12px",border:`1.5px solid ${M}18`}}>
            <span style={{fontSize:14,color:"#bbb"}}>🔍</span>
            <input placeholder="Search student or roll..." value={search} onChange={e=>setSearch(e.target.value)}
              style={{flex:1,border:"none",outline:"none",background:"transparent",fontSize:12,color:"#333"}}/>
          </div>
          <div style={{display:"flex",gap:5}}>
            {[["all","All"],["present","P"],["absent","A"]].map(([v,l])=>(
              <button key={v} onClick={()=>setFilter(v)}
                style={{padding:"8px 12px",borderRadius:10,border:"none",background:filter===v?M:"#eee",color:filter===v?"#fff":"#666",fontSize:11,fontWeight:600,cursor:"pointer"}}>{l}</button>
            ))}
          </div>
        </div>

        {/* Mark All buttons */}
        {(!submitted||editMode)&&(
          <div style={{display:"flex",gap:8,marginBottom:14}}>
            <button onClick={()=>markAll(true)} style={{flex:1,padding:"9px",borderRadius:10,border:`1.5px solid ${GREEN}40`,background:`${GREEN}10`,color:GREEN,fontSize:12,fontWeight:700,cursor:"pointer"}}>✅ All Present</button>
            <button onClick={()=>markAll(false)} style={{flex:1,padding:"9px",borderRadius:10,border:`1.5px solid ${RED}40`,background:`${RED}10`,color:RED,fontSize:12,fontWeight:700,cursor:"pointer"}}>❌ All Absent</button>
          </div>
        )}

        {/* Student list */}
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
          {displayed.map(student=>{
            const isPresent=att[student.id];
            const ms=msgStatus[student.id];
            return(
              <div key={student.id}
                style={{background:!isPresent?"#FFF5F5":MC,borderRadius:14,padding:"12px 16px",border:`1.5px solid ${!isPresent?RED+"28":M+"12"}`,display:"flex",alignItems:"center",gap:10,transition:"all .2s"}}>
                <div style={{width:24,fontSize:10,fontWeight:700,color:"#bbb",flexShrink:0,textAlign:"center"}}>{student.roll}</div>
                <div style={{width:38,height:38,borderRadius:"50%",background:!isPresent?"#FFEBEE":`${M}12`,display:"grid",placeItems:"center",fontSize:20,border:`2px solid ${!isPresent?RED+"30":M+"18"}`,flexShrink:0}}>{student.photo}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#222",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{student.name}</div>
                  <div style={{fontSize:10,color:"#aaa",marginTop:1}}>{student.parent} · 📱 {MASK_PHONE(student.phone)}</div>
                </div>
                {!isPresent&&ms&&(
                  <div style={{flexShrink:0,padding:"3px 9px",borderRadius:20,fontSize:10,fontWeight:700,
                    background:ms==="sent"?"#E8F5E9":ms==="failed"?"#FFEBEE":"#E3F2FD",
                    color:ms==="sent"?GREEN:ms==="failed"?RED:BLUE}}>
                    {ms==="sending"?"⏳":ms==="sent"?"✅":"❌"} {ms==="sending"?"Sending":ms==="sent"?"Sent":"Failed"}
                  </div>
                )}
                {!isPresent&&ms==="failed"&&(
                  <button onClick={async()=>{ const ok=await sendWA(student); setMsgStatus(p=>({...p,[student.id]:ok?"sent":"failed"})); }}
                    style={{flexShrink:0,padding:"5px 10px",borderRadius:8,border:`1.5px solid ${ORANGE}40`,background:"transparent",color:ORANGE,fontSize:10,fontWeight:700,cursor:"pointer"}}>Retry</button>
                )}
                {/* Toggle switch */}
                <div onClick={()=>toggle(student.id)}
                  style={{flexShrink:0,width:50,height:26,borderRadius:13,background:isPresent?GREEN:RED,position:"relative",cursor:(submitted&&!editMode)?"not-allowed":"pointer",transition:"background .25s",opacity:(submitted&&!editMode)?0.6:1}}>
                  <div style={{position:"absolute",top:3,left:isPresent?26:3,width:20,height:20,borderRadius:"50%",background:"#fff",boxShadow:"0 2px 6px rgba(0,0,0,0.2)",transition:"left .25s"}}/>
                  <span style={{position:"absolute",top:"50%",transform:"translateY(-50%)",left:isPresent?6:"auto",right:isPresent?"auto":6,fontSize:9,fontWeight:800,color:"#fff"}}>
                    {isPresent?"P":"A"}
                  </span>
                </div>
              </div>
            );
          })}
          {displayed.length===0&&<div style={{textAlign:"center",padding:"32px 20px",color:"#ccc"}}>No students match your filter.</div>}
        </div>

        {/* WA preview */}
        {absentCount>0&&!submitted&&(
          <div style={{background:"#F1F8E9",borderRadius:14,padding:"14px 16px",marginBottom:20,border:`1.5px solid ${GREEN}30`}}>
            <div style={{fontSize:11,fontWeight:700,color:GREEN,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>💬 WhatsApp Message Preview</div>
            <div style={{fontSize:12,color:"#444",lineHeight:1.65,fontStyle:"italic",background:"#fff",borderRadius:10,padding:"10px 12px",border:"1px solid #E8F5E9"}}>
              "Dear Parent, your child <strong>[Student Name]</strong> was marked absent from G.L. International School today, {TODAY_STR}. Please contact the office if this is an error."
            </div>
            <div style={{fontSize:11,color:"#888",marginTop:8}}>Will be sent to <strong style={{color:RED}}>{absentCount} parent{absentCount>1?"s":""}</strong> via WhatsApp Business API.</div>
          </div>
        )}

        {/* API info badge */}
        <div style={{display:"flex",gap:8,padding:"10px 14px",borderRadius:12,background:`${PURPLE}08`,border:`1px solid ${PURPLE}18`,marginBottom:16}}>
          <span style={{fontSize:16}}>⚙️</span>
          <span style={{fontSize:11,color:"#666"}}>Integration: <strong>Twilio WhatsApp Business API</strong> / Meta Graph API · Messages logged securely · Phone numbers masked in UI</span>
        </div>

        {/* Submit button */}
        {(!submitted||editMode)&&(
          <button onClick={()=>setConfirming(true)} disabled={sending}
            style={{width:"100%",padding:"15px",borderRadius:14,border:"none",background:sending?"#ddd":`linear-gradient(135deg,#1A0A0A 0%,${MD} 40%,${M} 100%)`,color:sending?"#aaa":"#fff",fontSize:15,fontWeight:800,cursor:sending?"not-allowed":"pointer",boxShadow:sending?"none":`0 8px 28px ${M}55`,letterSpacing:0.5,transition:"all .2s"}}>
            {sending?"⏳ Submitting & Sending...":editMode?"📤 Update Attendance":`📤 Submit${absentCount>0?` & Notify ${absentCount} Parent${absentCount>1?"s":""}`:" Attendance"}`}
          </button>
        )}

        {/* Done state */}
        {submitted&&!editMode&&(
          <div style={{display:"flex",gap:10,padding:"13px 16px",borderRadius:14,background:`${GREEN}10`,border:`1.5px solid ${GREEN}30`,alignItems:"center"}}>
            <span style={{fontSize:24}}>🎉</span>
            <div>
              <div style={{fontSize:13,fontWeight:800,color:GREEN}}>Attendance Submitted Successfully</div>
              <div style={{fontSize:11,color:"#666",marginTop:2}}>
                {absentCount>0?`${sentCount} of ${absentCount} WhatsApp notification${sentCount>1?"s":""} sent.`:"All students present — no notifications required."}
              </div>
            </div>
          </div>
        )}

        {/* Confirmation dialog */}
        {confirming&&(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
            <div style={{background:"#fff",borderRadius:20,padding:"28px 24px",maxWidth:380,width:"100%",boxShadow:"0 24px 80px rgba(0,0,0,0.3)"}}>
              <div style={{fontSize:38,textAlign:"center",marginBottom:14}}>📤</div>
              <div style={{fontSize:17,fontWeight:900,color:"#222",textAlign:"center",fontFamily:"Georgia,serif",marginBottom:8}}>
                {editMode?"Update Attendance?":"Submit Attendance?"}
              </div>
              <div style={{fontSize:13,color:"#666",textAlign:"center",lineHeight:1.6,marginBottom:18}}>
                <strong style={{color:GREEN}}>{presentCount} Present</strong> · <strong style={{color:RED}}>{absentCount} Absent</strong>
                {absentCount>0&&!editMode&&(
                  <div style={{marginTop:8,padding:"10px 14px",borderRadius:10,background:"#FFF3E0",border:"1px solid #FFE0B2",fontSize:12,color:ORANGE}}>
                    ⚠️ WhatsApp will be sent to <strong>{absentCount} parent{absentCount>1?"s":""}</strong>:
                    <div style={{marginTop:4,fontSize:11,color:"#888"}}>{absentList.slice(0,3).map(s=>s.name).join(", ")}{absentCount>3?` +${absentCount-3} more`:""}</div>
                  </div>
                )}
                {editMode&&<div style={{marginTop:8,fontSize:12,color:BLUE}}>ℹ️ No new messages will be sent for edits.</div>}
              </div>
              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>setConfirming(false)} style={{flex:1,padding:"12px",borderRadius:11,border:"1.5px solid #eee",background:"#fafafa",color:"#666",fontSize:13,fontWeight:600,cursor:"pointer"}}>Cancel</button>
                <button onClick={doSubmit} style={{flex:1,padding:"12px",borderRadius:11,border:"none",background:`linear-gradient(135deg,${MD},${M})`,color:"#fff",fontSize:13,fontWeight:800,cursor:"pointer",boxShadow:`0 4px 16px ${M}44`}}>
                  {editMode?"Update":"Confirm & Send"}
                </button>
              </div>
            </div>
          </div>
        )}
      </>}

      {section==="history"&&(
        <div>
          <div style={{fontSize:11,fontWeight:700,color:M,textTransform:"uppercase",letterSpacing:1.5,marginBottom:14}}>📊 Attendance History — Class 3 A</div>
          {history.length===0?(
            <div style={{textAlign:"center",padding:"48px 20px",color:"#ccc"}}>
              <div style={{fontSize:48,marginBottom:12}}>📭</div>
              <div>No records yet. Submit today's attendance to begin.</div>
            </div>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {history.map((r,i)=>{
                const pct=Math.round(r.present/r.total*100);
                return(
                  <div key={i} style={{background:MC,borderRadius:14,padding:"14px 16px",border:`1.5px solid ${M}12`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                      <div>
                        <div style={{fontSize:13,fontWeight:700,color:"#222"}}>{r.date}</div>
                        <div style={{fontSize:11,color:"#aaa",marginTop:2}}>
                          <span style={{color:GREEN,fontWeight:600}}>{r.present} present</span> · <span style={{color:RED,fontWeight:600}}>{r.absent} absent</span>
                        </div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:16,fontWeight:900,color:pct>=90?GREEN:pct>=80?TEAL:ORANGE}}>{pct}%</div>
                        {r.msgsSent>0&&<div style={{fontSize:10,color:GREEN,marginTop:2}}>💬 {r.msgsSent} sent</div>}
                        {r.msgsFailed>0&&<div style={{fontSize:10,color:RED,marginTop:1}}>❌ {r.msgsFailed} failed</div>}
                      </div>
                    </div>
                    <div style={{background:"#f0e8df",borderRadius:5,height:7}}>
                      <div style={{width:pct+"%",height:"100%",borderRadius:5,background:pct>=90?GREEN:pct>=80?TEAL:ORANGE}}/>
                    </div>
                    {r.absentees.length>0&&(
                      <div style={{marginTop:8,fontSize:11,color:"#888"}}>Absent: <span style={{color:RED,fontWeight:600}}>{r.absentees.join(", ")}</span></div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


// ═══════════════════════════════════════════
//  EXAM MARKS ENTRY & REPORT CARD MODULE
// ═══════════════════════════════════════════


function TeacherExams() {
  const [cls,       setCls]      = useState("Class 3");
  const [sec,       setSec]      = useState("A");
  const [subject,   setSubject]  = useState("maths");
  const [examType,  setExamType] = useState("Mid-Term");
  const [examDate,  setExamDate] = useState(new Date().toISOString().slice(0,10));
  const [tab,       setTab]      = useState("entry");
  const [marksDB,   setMarksDB]  = useState({});
  const [lockedExams,setLockedExams] = useState({});
  const [loading,   setLoading]  = useState(true);
  const [saved,     setSaved]    = useState(false);
  const [rcStudent, setRcStudent]= useState(null);
  const [timelineStudent, setTimelineStudent] = useState(null);
  const [csvErr,    setCsvErr]   = useState("");
  const fileRef = useRef();

  const examKey  = `${cls}-${sec}-${subject}-${examType}`;
  const maxMarks = EXAM_CONFIG[examType].maxMarks;
  const curMarks = marksDB[examKey] || {};
  const isLocked = lockedExams[examKey] || false;

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get(EXAMS_STORE);
        if (r?.value) { const d = JSON.parse(r.value); setMarksDB(d.marks||{}); setLockedExams(d.locked||{}); }
      } catch {}
      setLoading(false);
    })();
  }, []);

  const persist = async (nm, nl) => {
    try { await window.storage.set(EXAMS_STORE, JSON.stringify({ marks: nm, locked: nl })); } catch {}
  };

  const setMark   = (id, v) => {
    if (isLocked) return;
    const num = v === "" ? "" : Math.min(Number(v), maxMarks);
    const upd = { ...marksDB, [examKey]: { ...curMarks, [id]: { ...(curMarks[id]||{}), marks: num } } };
    setMarksDB(upd); setSaved(false);
  };
  const setRemark = (id, v) => {
    if (isLocked) return;
    const upd = { ...marksDB, [examKey]: { ...curMarks, [id]: { ...(curMarks[id]||{}), remark: v } } };
    setMarksDB(upd); setSaved(false);
  };
  const handleSave = async () => { await persist(marksDB, lockedExams); setSaved(true); setTimeout(()=>setSaved(false),3000); };
  const handleLock = async () => { const nl={...lockedExams,[examKey]:true}; setLockedExams(nl); await persist(marksDB,nl); };
  const handleUnlock = async () => { const nl={...lockedExams,[examKey]:false}; setLockedExams(nl); await persist(marksDB,nl); };

  const handleCSV = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setCsvErr("");
    const text = await file.text();
    const lines = text.trim().split("\n").slice(1);
    const upd = { ...curMarks }; let errors = 0;
    lines.forEach(line => {
      const cols = line.split(",").map(c=>c.trim().replace(/"/g,""));
      const roll = parseInt(cols[0]); const marks = parseFloat(cols[1]); const remark = cols[2]||"";
      const st = EXAM_STUDENTS.find(s=>s.roll===roll);
      if (!st||isNaN(marks)||marks<0||marks>maxMarks) { errors++; return; }
      upd[st.id] = { marks, remark };
    });
    const nm = { ...marksDB, [examKey]: upd };
    setMarksDB(nm); await persist(nm, lockedExams);
    if (errors>0) setCsvErr(`${errors} row(s) skipped.`);
    if (fileRef.current) fileRef.current.value = "";
  };

  // ── COMPUTED STATS ──
  const enteredList = EXAM_STUDENTS.map(s=>({...s,e:curMarks[s.id]||{}})).filter(s=>s.e.marks!==undefined&&s.e.marks!=="");
  const missingCount= EXAM_STUDENTS.length - enteredList.length;
  const enteredCount= enteredList.length;
  const failList    = enteredList.filter(s=>(Number(s.e.marks)/maxMarks*100)<33);
  const passCount   = enteredCount - failList.length;
  const classAvg    = enteredCount>0 ? enteredList.reduce((a,s)=>a+Number(s.e.marks),0)/enteredCount : 0;
  const highest     = enteredCount>0 ? Math.max(...enteredList.map(s=>Number(s.e.marks))) : 0;
  const lowest      = enteredCount>0 ? Math.min(...enteredList.map(s=>Number(s.e.marks))) : 0;
  const topStudents = [...enteredList].sort((a,b)=>Number(b.e.marks)-Number(a.e.marks)).slice(0,3);
  const atRisk      = enteredList.filter(s=>(Number(s.e.marks)/maxMarks*100)<50);

  // Grade distribution
  const gradeDist = enteredList.reduce((acc,s)=>{
    const g = calcGrade(Number(s.e.marks)/maxMarks*100).g;
    acc[g]=(acc[g]||0)+1; return acc;
  },{});
  const gradeOrder = ["A+","A","B+","B","C","D","F"];
  const gradeChartData = gradeOrder.filter(g=>gradeDist[g]).map(g=>({name:g,count:gradeDist[g],pct:Math.round(gradeDist[g]/enteredCount*100)}));

  // Subject-wise class averages (across all subjects for current exam type)
  const subjectAverages = SUBJECTS_CONFIG.map(sub => {
    const key = `${cls}-${sec}-${sub.id}-${examType}`;
    const subMarks = marksDB[key] || {};
    const vals = EXAM_STUDENTS.map(s=>subMarks[s.id]).filter(e=>e&&e.marks!==undefined&&e.marks!=="").map(e=>Number(e.marks));
    const avg = vals.length>0 ? Math.round(vals.reduce((a,b)=>a+b,0)/vals.length/maxMarks*100) : null;
    return { name: sub.name, icon: sub.icon, avg, count: vals.length };
  });

  // Ranked list for current exam
  const rankedList = [...enteredList].sort((a,b)=>Number(b.e.marks)-Number(a.e.marks))
    .map((s,i)=>({...s,rank:i+1,percentile:Math.round((enteredCount-i)/enteredCount*100)}));

  // Build full report card for a student
  const buildRC = (student) => {
    const subjects = SUBJECTS_CONFIG.map(sub => {
      const exams = Object.entries(EXAM_CONFIG).map(([et,cfg]) => {
        const k = `${cls}-${sec}-${sub.id}-${et}`;
        const e = (marksDB[k]||{})[student.id];
        if (!e||e.marks===""||e.marks===undefined) return null;
        return { et, marks:Number(e.marks), max:cfg.maxMarks, w:cfg.weightage, pct:Math.round(Number(e.marks)/cfg.maxMarks*100), remark:e.remark||"" };
      }).filter(Boolean);
      if (!exams.length) return { ...sub, exams:[], pct:null };
      const tw = exams.reduce((a,e)=>a+e.w,0);
      const wp = exams.reduce((a,e)=>a+(e.marks/e.max*e.w),0);
      return { ...sub, exams, pct:Math.round(wp/tw*100) };
    });
    const graded = subjects.filter(s=>s.pct!==null);
    const overall = graded.length ? Math.round(graded.reduce((a,s)=>a+s.pct,0)/graded.length) : null;
    const gpa     = graded.length ? (graded.reduce((a,s)=>a+calcGrade(s.pct).gpa,0)/graded.length).toFixed(2) : null;
    const rankedEntry = rankedList.find(r=>r.id===student.id);
    const best  = graded.length ? graded.reduce((a,s)=>s.pct>a.pct?s:a) : null;
    const worst = graded.length ? graded.reduce((a,s)=>s.pct<a.pct?s:a) : null;
    return { subjects, graded, overall, gpa, rank:rankedEntry?.rank||null, percentile:rankedEntry?.percentile||null, best, worst };
  };

  const InfoTag = ({label, value, color=M, bg}) => (
    <div style={{textAlign:"center",padding:"10px 14px",borderRadius:12,background:bg||`${color}10`,border:`1px solid ${color}20`}}>
      <div style={{fontSize:18,fontWeight:900,color,fontFamily:"Georgia,serif"}}>{value}</div>
      <div style={{fontSize:9,color:"#aaa",textTransform:"uppercase",letterSpacing:0.8,marginTop:2}}>{label}</div>
    </div>
  );

  return (
    <div style={{paddingBottom:48}}>

      {/* ─── HERO HEADER ─── */}
      <div style={{background:"linear-gradient(135deg,#0D1B2A 0%,#1B2A4A 50%,#162944 100%)",borderRadius:20,padding:"18px 22px",marginBottom:20,boxShadow:"0 12px 40px rgba(13,27,42,0.55)",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-40,right:-40,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,0.03)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:-20,left:40,width:100,height:100,borderRadius:"50%",background:"rgba(255,255,255,0.03)",pointerEvents:"none"}}/>
        <div style={{fontSize:19,fontWeight:900,color:"#fff",fontFamily:"Georgia,serif",marginBottom:2}}>📝 Exam Marks & Report Cards</div>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",marginBottom:16}}>Mrs. Priya Nair · {cls} – {sec} · {examType}</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
          {[
            ["Entered",`${enteredCount}/${EXAM_STUDENTS.length}`,"#1565C099","#90CAF9"],
            ["Passed", passCount,"#1B5E2099","#A5D6A7"],
            ["Failing",failList.length,"#B71C1C99","#FFCDD2"],
            ["Class Avg",enteredCount>0?`${Math.round(classAvg)}/${maxMarks}`:"–","rgba(255,255,255,0.1)","#FFF9C4"],
          ].map(([l,v,bg,c])=>(
            <div key={l} style={{padding:"10px 4px",borderRadius:12,background:bg,textAlign:"center",border:"1px solid rgba(255,255,255,0.07)"}}>
              <div style={{fontSize:18,fontWeight:900,color:c,fontFamily:"Georgia,serif"}}>{v}</div>
              <div style={{fontSize:9,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:1,marginTop:2}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── TABS ─── */}
      <div style={{display:"flex",gap:6,marginBottom:18,background:"#f0e8df",borderRadius:12,padding:5}}>
        {[["entry","📋 Enter Marks"],["timeline","📈 Timeline"],["reportcard","🎓 Report Cards"]].map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)}
            style={{flex:1,padding:"9px 6px",borderRadius:9,border:"none",background:tab===id?"#fff":"transparent",color:tab===id?M:"#999",fontSize:11,fontWeight:700,cursor:"pointer",boxShadow:tab===id?`0 2px 10px ${M}22`:"none",transition:"all .2s"}}>
            {label}
          </button>
        ))}
      </div>

      {/* ══════════════════ MARKS ENTRY ══════════════════ */}
      {tab==="entry" && (
        <>
          {/* Filters */}
          <div style={{background:"#fff",borderRadius:16,padding:"16px 18px",marginBottom:14,border:`1px solid ${M}12`,boxShadow:"0 2px 12px rgba(0,0,0,0.04)"}}>
            <div style={{fontSize:11,fontWeight:700,color:M,textTransform:"uppercase",letterSpacing:1.5,marginBottom:12}}>🎛 Exam Configuration</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
              {[["Class",cls,setCls,CLASSES_CONFIG.map(c=>({v:c,l:c}))],
                ["Section",sec,setSec,SECTIONS_CONFIG.map(s=>({v:s,l:s}))],
                ["Subject",subject,setSubject,SUBJECTS_CONFIG.map(s=>({v:s.id,l:`${s.icon} ${s.name}`}))],
                ["Exam Type",examType,setExamType,Object.keys(EXAM_CONFIG).map(e=>({v:e,l:e}))],
              ].map(([label,val,setter,opts])=>(
                <div key={label}>
                  <div style={{fontSize:10,fontWeight:700,color:"#888",marginBottom:5,textTransform:"uppercase",letterSpacing:0.8}}>{label}</div>
                  <select value={val} onChange={e=>setter(e.target.value)} style={{width:"100%",padding:"9px 12px",borderRadius:10,border:`1.5px solid ${M}25`,background:"#FAFAF8",fontSize:13,color:"#222",outline:"none"}}>
                    {opts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:10}}>
              <div style={{flex:1}}>
                <div style={{fontSize:10,fontWeight:700,color:"#888",marginBottom:5,textTransform:"uppercase",letterSpacing:0.8}}>Exam Date</div>
                <input type="date" value={examDate} onChange={e=>setExamDate(e.target.value)} style={{width:"100%",padding:"9px 12px",borderRadius:10,border:`1.5px solid ${M}25`,background:"#FAFAF8",fontSize:13,boxSizing:"border-box",outline:"none"}}/>
              </div>
              <div style={{flex:1,padding:"12px 16px",borderRadius:10,background:`${M}08`,border:`1.5px solid ${M}20`,display:"flex",gap:14,alignItems:"center"}}>
                <div>
                  <div style={{fontSize:10,color:"#aaa",textTransform:"uppercase",letterSpacing:0.8}}>Max Marks</div>
                  <div style={{fontSize:20,fontWeight:900,color:M}}>{maxMarks}</div>
                </div>
                <div>
                  <div style={{fontSize:10,color:"#aaa",textTransform:"uppercase",letterSpacing:0.8}}>Weightage</div>
                  <div style={{fontSize:20,fontWeight:900,color:BLUE}}>{EXAM_CONFIG[examType].weightage}%</div>
                </div>
                <div>
                  <div style={{fontSize:10,color:"#aaa",textTransform:"uppercase",letterSpacing:0.8}}>Pass Mark</div>
                  <div style={{fontSize:20,fontWeight:900,color:GREEN}}>{Math.round(maxMarks*0.33)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress + grade dist */}
          <div style={{background:"#fff",borderRadius:14,padding:"14px 16px",marginBottom:14,border:`1px solid ${M}12`}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <span style={{fontSize:12,fontWeight:700,color:"#333"}}>Entry Progress</span>
              <span style={{fontSize:12,fontWeight:800,color:enteredCount===EXAM_STUDENTS.length?GREEN:ORANGE}}>
                {enteredCount}/{EXAM_STUDENTS.length} · {missingCount} missing
              </span>
            </div>
            <div style={{background:"#f0e8df",borderRadius:6,height:10,marginBottom:10}}>
              <div style={{width:`${enteredCount/EXAM_STUDENTS.length*100}%`,height:"100%",borderRadius:6,background:enteredCount===EXAM_STUDENTS.length?GREEN:M,transition:"width .5s"}}/>
            </div>
            {enteredCount>0 && (
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:6}}>
                {gradeOrder.filter(g=>gradeDist[g]).map(g=>{
                  const info=calcGrade(g==="A+"?95:g==="A"?85:g==="B+"?75:g==="B"?65:g==="C"?55:g==="D"?40:20);
                  return <span key={g} style={{padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:info.bg,color:info.color}}>{g}: {gradeDist[g]}</span>;
                })}
              </div>
            )}
            {enteredCount>0 && (
              <div style={{display:"flex",gap:10,marginTop:8,flexWrap:"wrap"}}>
                <span style={{fontSize:11,color:"#888"}}>🏆 Highest: <strong style={{color:GREEN}}>{highest}/{maxMarks}</strong></span>
                <span style={{fontSize:11,color:"#888"}}>📉 Lowest: <strong style={{color:RED}}>{lowest}/{maxMarks}</strong></span>
                <span style={{fontSize:11,color:"#888"}}>📊 Avg: <strong style={{color:M}}>{classAvg.toFixed(1)}/{maxMarks}</strong></span>
                <span style={{fontSize:11,color:"#888"}}>✅ Pass Rate: <strong style={{color:GREEN}}>{Math.round(passCount/enteredCount*100)}%</strong></span>
              </div>
            )}
          </div>

          {/* Action bar */}
          <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
            <input ref={fileRef} type="file" accept=".csv" onChange={handleCSV} style={{display:"none"}}/>
            <button onClick={()=>fileRef.current?.click()} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 14px",borderRadius:10,border:`1.5px solid ${BLUE}35`,background:`${BLUE}08`,color:BLUE,fontSize:12,fontWeight:700,cursor:"pointer"}}>📥 CSV Upload</button>
            <button onClick={()=>{
              const blob=new Blob(["Roll No,Marks Obtained,Remark\n"+EXAM_STUDENTS.map(s=>`${s.roll},,`).join("\n")],{type:"text/csv"});
              const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`template-${examKey}.csv`;a.click();
            }} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 14px",borderRadius:10,border:`1.5px solid ${TEAL}35`,background:`${TEAL}08`,color:TEAL,fontSize:12,fontWeight:700,cursor:"pointer"}}>📤 Template</button>
            <div style={{flex:1}}/>
            {!isLocked ? (
              <>
                <button onClick={handleSave} style={{padding:"9px 16px",borderRadius:10,border:"none",background:saved?GREEN:M,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",transition:"background .3s"}}>
                  {saved?"✅ Saved":"💾 Save"}
                </button>
                <button onClick={handleLock} disabled={enteredCount<EXAM_STUDENTS.length} style={{padding:"9px 16px",borderRadius:10,border:"none",background:enteredCount<EXAM_STUDENTS.length?"#ddd":"#1B5E20",color:enteredCount<EXAM_STUDENTS.length?"#bbb":"#fff",fontSize:12,fontWeight:700,cursor:enteredCount<EXAM_STUDENTS.length?"not-allowed":"pointer"}}>
                  🔒 Finalize
                </button>
              </>
            ) : (
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <div style={{padding:"7px 14px",borderRadius:10,background:"#E8F5E9",color:GREEN,fontSize:12,fontWeight:700}}>🔒 Locked</div>
                <button onClick={handleUnlock} style={{padding:"7px 12px",borderRadius:10,border:`1.5px solid ${ORANGE}40`,background:"transparent",color:ORANGE,fontSize:11,fontWeight:700,cursor:"pointer"}}>🔓 Unlock</button>
              </div>
            )}
          </div>
          {csvErr&&<div style={{padding:"8px 14px",borderRadius:10,background:"#FFEBEE",color:RED,fontSize:12,marginBottom:12}}>⚠️ {csvErr}</div>}

          {/* ── SPREADSHEET TABLE ── */}
          <div style={{background:"#fff",borderRadius:16,border:`1px solid ${M}15`,overflow:"hidden",boxShadow:"0 4px 20px rgba(0,0,0,0.06)"}}>
            {/* Header */}
            <div style={{display:"grid",gridTemplateColumns:"36px minmax(120px,1fr) 100px 72px 60px 1fr",padding:"10px 16px",background:"linear-gradient(135deg,#0D1B2A,#162944)"}}>
              {["#","Student","Marks","vs Avg","Grade","Remarks"].map((h,i)=>(
                <div key={h} style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.55)",textTransform:"uppercase",letterSpacing:0.8,textAlign:i>1&&i<5?"center":"left"}}>{h}</div>
              ))}
            </div>

            {loading ? <div style={{padding:40,textAlign:"center",color:"#ccc"}}>Loading...</div> :
              EXAM_STUDENTS.map((student,idx)=>{
                const entry    = curMarks[student.id]||{};
                const marks    = entry.marks;
                const hasVal   = marks!==undefined&&marks!=="";
                const pct      = hasVal ? Number(marks)/maxMarks*100 : null;
                const gr       = pct!==null ? calcGrade(pct) : null;
                const isFail   = pct!==null && pct<33;
                const isWarn   = pct!==null && pct>=33 && pct<50;
                const diff     = hasVal && classAvg>0 ? Number(marks)-classAvg : null;
                const diffPct  = diff!==null ? (diff/classAvg*100).toFixed(0) : null;
                const rowBg    = isFail?"#FFF5F5":isWarn?"#FFFBF0":idx%2===0?"#FAFAF8":"#fff";

                return (
                  <div key={student.id} style={{display:"grid",gridTemplateColumns:"36px minmax(120px,1fr) 100px 72px 60px 1fr",padding:"8px 16px",background:rowBg,borderBottom:"1px solid #F0E8DF",alignItems:"center",transition:"background .2s"}}>
                    <div style={{fontSize:11,color:"#bbb",fontWeight:600}}>{student.roll}</div>
                    {/* Name */}
                    <div style={{display:"flex",alignItems:"center",gap:8,minWidth:0}}>
                      <div style={{width:32,height:32,borderRadius:"50%",background:gr?gr.bg:`${M}10`,display:"grid",placeItems:"center",fontSize:16,border:`2px solid ${gr?gr.color+"30":M+"15"}`,flexShrink:0}}>{student.photo}</div>
                      <div style={{minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:600,color:"#222",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{student.name}</div>
                        {isFail && <div style={{fontSize:9,color:RED,fontWeight:700,textTransform:"uppercase",letterSpacing:0.4}}>⚠ Failing</div>}
                        {isWarn && !isFail && <div style={{fontSize:9,color:ORANGE,fontWeight:700,textTransform:"uppercase",letterSpacing:0.4}}>⚠ At Risk</div>}
                      </div>
                    </div>
                    {/* Marks input */}
                    <div style={{display:"flex",alignItems:"center",gap:4,justifyContent:"center"}}>
                      <input type="number" min="0" max={maxMarks} value={marks===undefined?"":marks}
                        onChange={e=>setMark(student.id,e.target.value)} placeholder="–" disabled={isLocked}
                        style={{width:52,padding:"6px 6px",borderRadius:8,border:`2px solid ${isFail?RED:isWarn?ORANGE:hasVal?GREEN:M+"30"}`,background:isFail?"#FFEBEE":isWarn?"#FFF8E1":hasVal?`${GREEN}08`:"#fff",fontSize:14,fontWeight:700,textAlign:"center",color:isFail?RED:isWarn?ORANGE:"#222",outline:"none",cursor:isLocked?"not-allowed":"text"}}
                      />
                      <span style={{fontSize:10,color:"#bbb"}}>/{maxMarks}</span>
                    </div>
                    {/* vs Class Avg */}
                    <div style={{textAlign:"center"}}>
                      {diff!==null ? (
                        <span style={{fontSize:11,fontWeight:800,color:diff>=0?GREEN:RED,padding:"2px 6px",borderRadius:8,background:diff>=0?`${GREEN}10`:`${RED}10`}}>
                          {diff>=0?"+":""}{diff>=0?"+":""}{Number(diff).toFixed(0)}
                        </span>
                      ) : <span style={{color:"#ddd",fontSize:16}}>–</span>}
                    </div>
                    {/* Grade */}
                    <div style={{textAlign:"center"}}>
                      {gr ? <span style={{padding:"3px 9px",borderRadius:20,fontSize:12,fontWeight:800,background:gr.bg,color:gr.color}}>{gr.g}</span>
                           :<span style={{color:"#ddd",fontSize:16}}>–</span>}
                    </div>
                    {/* Remark */}
                    <input type="text" placeholder="Add remark…" value={entry.remark||""}
                      onChange={e=>setRemark(student.id,e.target.value)} disabled={isLocked}
                      style={{padding:"6px 10px",borderRadius:8,border:`1.5px solid ${M}18`,background:"transparent",fontSize:11,color:"#555",outline:"none",width:"100%",boxSizing:"border-box",cursor:isLocked?"not-allowed":"text"}}
                    />
                  </div>
                );
              })
            }
            {/* Footer */}
            {enteredCount>0&&(
              <div style={{display:"grid",gridTemplateColumns:"36px minmax(120px,1fr) 100px 72px 60px 1fr",padding:"10px 16px",background:"#F0E8DF",borderTop:`2px solid ${M}20`,alignItems:"center"}}>
                <div/>
                <div style={{fontSize:11,fontWeight:700,color:M}}>Class Summary ({enteredCount} students)</div>
                <div style={{textAlign:"center",fontSize:12,fontWeight:800,color:M}}>{classAvg.toFixed(1)}/{maxMarks}</div>
                <div style={{textAlign:"center",fontSize:11,color:"#888"}}>Avg</div>
                <div style={{textAlign:"center"}}>
                  <span style={{fontSize:11,fontWeight:800,color:calcGrade(classAvg/maxMarks*100).color}}>{calcGrade(classAvg/maxMarks*100).g}</span>
                </div>
                <div style={{fontSize:11,color:failList.length>0?RED:GREEN,fontWeight:600}}>{failList.length>0?`⚠ ${failList.length} failing`:"✅ All passing"}</div>
              </div>
            )}
          </div>
        </>
      )}

      {/* ══════════════════ ANALYTICS ══════════════════ */}
      {/* ══ PERFORMANCE TIMELINE TAB ══ */}
      {tab==="timeline" && (
        <div>
          {timelineStudent ? (()=>{
            const timeline = SUBJECTS_CONFIG.map(sub=>{
              const examPoints = Object.entries(EXAM_CONFIG).map(([et,cfg])=>{
                const k=`${cls}-${sec}-${sub.id}-${et}`;
                const e=(marksDB[k]||{})[timelineStudent.id];
                if(!e||e.marks===""||e.marks===undefined) return null;
                const pct=Math.round(Number(e.marks)/cfg.maxMarks*100);
                return {examType:et,marks:Number(e.marks),maxMarks:cfg.maxMarks,pct,gr:calcGrade(pct)};
              }).filter(Boolean);
              const avg=examPoints.length>0?Math.round(examPoints.reduce((a,e)=>a+e.pct,0)/examPoints.length):null;
              return {...sub,examPoints,avg};
            });
            const hasAny = timeline.some(s=>s.examPoints.length>0);
            const allTrends = timeline.filter(s=>s.examPoints.length>1).map(s=>{const pts=s.examPoints;return pts[pts.length-1].pct-pts[0].pct;});
            const avgTrend = allTrends.length>0?(allTrends.reduce((a,v)=>a+v,0)/allTrends.length).toFixed(1):null;
            const bestSub  = timeline.filter(s=>s.avg!==null).sort((a,b)=>b.avg-a.avg)[0];
            const weakSub  = timeline.filter(s=>s.avg!==null).sort((a,b)=>a.avg-b.avg)[0];
            return (
              <div>
                <button onClick={()=>setTimelineStudent(null)} style={{display:"flex",alignItems:"center",gap:8,marginBottom:16,padding:"8px 16px",borderRadius:10,border:`1.5px solid ${M}25`,background:"transparent",color:M,fontSize:13,fontWeight:600,cursor:"pointer"}}>← All Students</button>
                {/* Hero */}
                <div style={{background:"linear-gradient(135deg,#0D1B2A 0%,#1B2A4A 50%,#162944 100%)",borderRadius:16,padding:"16px 20px",marginBottom:16,display:"flex",alignItems:"center",gap:14}}>
                  <div style={{width:52,height:52,borderRadius:"50%",background:"rgba(255,255,255,0.18)",display:"grid",placeItems:"center",fontSize:28,border:"2px solid rgba(255,255,255,0.25)",flexShrink:0}}>{timelineStudent.photo}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:17,fontWeight:900,color:"#fff",fontFamily:"Georgia,serif"}}>{timelineStudent.name}</div>
                    <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",marginTop:2}}>{cls} – {sec} · Roll {timelineStudent.roll} · All Exams Timeline</div>
                  </div>
                  {avgTrend!==null&&(
                    <div style={{padding:"10px 14px",borderRadius:12,background:"rgba(255,255,255,0.1)",textAlign:"center",border:"1px solid rgba(255,255,255,0.15)"}}>
                      <div style={{fontSize:20,fontWeight:900,color:parseFloat(avgTrend)>0?"#A5D6A7":parseFloat(avgTrend)<0?"#FFCDD2":"#fff"}}>{parseFloat(avgTrend)>0?"↑":parseFloat(avgTrend)<0?"↓":"→"} {Math.abs(parseFloat(avgTrend))}%</div>
                      <div style={{fontSize:9,color:"rgba(255,255,255,0.45)"}}>Overall Trend</div>
                    </div>
                  )}
                </div>
                {/* Best / Weak */}
                {(bestSub||weakSub)&&(
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
                    {bestSub&&<div style={{background:"#E8F5E9",borderRadius:13,padding:"12px 14px",border:"1px solid #C8E6C9"}}>
                      <div style={{fontSize:10,fontWeight:700,color:GREEN,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>🏆 Strongest Subject</div>
                      <div style={{fontSize:13,fontWeight:800,color:"#1B5E20"}}>{bestSub.icon} {bestSub.name}</div>
                      <div style={{fontSize:20,fontWeight:900,color:GREEN}}>{bestSub.avg}% <span style={{fontSize:11,fontWeight:400,color:"#888"}}>{calcGrade(bestSub.avg).g}</span></div>
                    </div>}
                    {weakSub&&weakSub.id!==bestSub?.id&&<div style={{background:"#FFF3E0",borderRadius:13,padding:"12px 14px",border:"1px solid #FFE0B2"}}>
                      <div style={{fontSize:10,fontWeight:700,color:ORANGE,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>🎯 Focus Area</div>
                      <div style={{fontSize:13,fontWeight:800,color:"#E65100"}}>{weakSub.icon} {weakSub.name}</div>
                      <div style={{fontSize:20,fontWeight:900,color:ORANGE}}>{weakSub.avg}% <span style={{fontSize:11,fontWeight:400,color:"#888"}}>{calcGrade(weakSub.avg).g}</span></div>
                    </div>}
                  </div>
                )}
                {!hasAny?(
                  <div style={{textAlign:"center",padding:"48px 20px",color:"#ccc"}}>
                    <div style={{fontSize:48,marginBottom:12}}>📭</div>
                    <div>No exam records found yet. Enter marks first.</div>
                  </div>
                ):(
                  <div style={{display:"flex",flexDirection:"column",gap:14}}>
                    {timeline.filter(s=>s.examPoints.length>0).map(sub=>{
                      const latest = sub.examPoints[sub.examPoints.length-1];
                      const prev2  = sub.examPoints.length>1?sub.examPoints[sub.examPoints.length-2]:null;
                      const localTr= prev2?latest.pct-prev2.pct:null;
                      const avgGr  = calcGrade(sub.avg);
                      return(
                        <div key={sub.id} style={{background:"#fff",borderRadius:16,border:`1px solid ${M}12`,overflow:"hidden"}}>
                          <div style={{padding:"12px 16px",borderBottom:`1px solid ${M}08`,display:"flex",alignItems:"center",gap:10,background:"#FAFAF8"}}>
                            <span style={{fontSize:22}}>{sub.icon}</span>
                            <div style={{flex:1}}>
                              <div style={{fontSize:14,fontWeight:700,color:"#222"}}>{sub.name}</div>
                              <div style={{fontSize:11,color:"#aaa"}}>{sub.examPoints.length} exam{sub.examPoints.length>1?"s":""} recorded</div>
                            </div>
                            <div style={{display:"flex",gap:8,alignItems:"center"}}>
                              {localTr!==null&&(
                                <span style={{fontSize:12,fontWeight:700,color:localTr>0?GREEN:localTr<0?RED:"#aaa"}}>{localTr>0?"↑":localTr<0?"↓":"→"} {Math.abs(localTr)}%</span>
                              )}
                              <span style={{padding:"3px 10px",borderRadius:20,fontSize:12,fontWeight:800,background:avgGr.bg,color:avgGr.color}}>Avg {sub.avg}%</span>
                              <span style={{padding:"3px 10px",borderRadius:20,fontSize:12,fontWeight:800,background:avgGr.bg,color:avgGr.color}}>{avgGr.g}</span>
                            </div>
                          </div>
                          <div style={{padding:"14px 16px"}}>
                            <div style={{display:"flex",flexDirection:"column",gap:10}}>
                              {sub.examPoints.map((ep,idx)=>{
                                const prevEp=idx>0?sub.examPoints[idx-1]:null;
                                const epTr=prevEp?ep.pct-prevEp.pct:null;
                                return(
                                  <div key={ep.examType}>
                                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                                        <div style={{width:8,height:8,borderRadius:"50%",background:ep.gr.color,flexShrink:0,boxShadow:`0 0 0 3px ${ep.gr.color}25`}}/>
                                        <span style={{fontSize:12,fontWeight:600,color:"#333"}}>{ep.examType}</span>
                                        <span style={{fontSize:10,color:"#bbb"}}>{ep.marks}/{ep.maxMarks} marks</span>
                                      </div>
                                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                                        {epTr!==null&&<span style={{fontSize:11,fontWeight:700,color:epTr>0?GREEN:epTr<0?RED:"#aaa"}}>{epTr>0?"↑":epTr<0?"↓":"→"} {Math.abs(epTr)}%</span>}
                                        <span style={{padding:"2px 8px",borderRadius:20,fontSize:11,fontWeight:700,background:ep.gr.bg,color:ep.gr.color}}>{ep.gr.g}</span>
                                        <span style={{fontSize:12,fontWeight:800,color:ep.gr.color,minWidth:32,textAlign:"right"}}>{ep.pct}%</span>
                                      </div>
                                    </div>
                                    <div style={{background:"#f0e8df",borderRadius:6,height:14,position:"relative",overflow:"hidden"}}>
                                      <div style={{width:`${ep.pct}%`,height:"100%",borderRadius:6,background:`linear-gradient(90deg,${ep.gr.color}55,${ep.gr.color})`,transition:"width 1s ease"}}/>
                                      <div style={{position:"absolute",top:0,left:"33%",width:1.5,height:"100%",background:"rgba(0,0,0,0.12)"}}/>
                                      {ep.pct>=33&&<span style={{position:"absolute",top:"50%",transform:"translateY(-50%)",right:6,fontSize:9,fontWeight:700,color:ep.gr.color}}>{ep.pct}%</span>}
                                    </div>
                                    {idx<sub.examPoints.length-1&&<div style={{width:2,height:8,background:`${M}18`,marginLeft:3,marginTop:2}}/>}
                                  </div>
                                );
                              })}
                            </div>
                            {/* Mini bar chart sparkline */}
                            {sub.examPoints.length>1&&(
                              <div style={{marginTop:12,padding:"10px 12px",borderRadius:10,background:"#F9F4EE",display:"flex",alignItems:"center",gap:12}}>
                                <div style={{flex:1}}>
                                  <div style={{display:"flex",gap:3,alignItems:"flex-end",height:32}}>
                                    {sub.examPoints.map((ep,i)=>(
                                      <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                                        <div style={{width:"100%",borderRadius:"3px 3px 0 0",background:ep.gr.color,height:`${Math.max(4,ep.pct*0.3)}px`,transition:"height 1s"}}/>
                                        <div style={{fontSize:7,color:"#aaa",textAlign:"center"}}>{ep.examType.slice(0,3)}</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div style={{textAlign:"right",flexShrink:0}}>
                                  <div style={{fontSize:11,color:"#888"}}>Avg: <strong style={{color:avgGr.color}}>{sub.avg}%</strong></div>
                                  <div style={{fontSize:10,color:"#aaa"}}>Range: {Math.min(...sub.examPoints.map(e=>e.pct))}–{Math.max(...sub.examPoints.map(e=>e.pct))}%</div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })() : (
            <div>
              <div style={{fontSize:11,fontWeight:700,color:M,textTransform:"uppercase",letterSpacing:1.5,marginBottom:14}}>📈 Select a student to view their full performance timeline</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {EXAM_STUDENTS.map(student=>{
                  const allPcts=SUBJECTS_CONFIG.flatMap(sub=>Object.entries(EXAM_CONFIG).map(([et,cfg])=>{
                    const k=`${cls}-${sec}-${sub.id}-${et}`;const e=(marksDB[k]||{})[student.id];
                    if(!e||e.marks===""||e.marks===undefined) return null;
                    return Math.round(Number(e.marks)/cfg.maxMarks*100);
                  })).filter(v=>v!==null);
                  const overall=allPcts.length>0?Math.round(allPcts.reduce((a,v)=>a+v,0)/allPcts.length):null;
                  const gr=overall!==null?calcGrade(overall):null;
                  const trendVal=allPcts.length>1?allPcts[allPcts.length-1]-allPcts[0]:null;
                  return(
                    <div key={student.id} onClick={()=>setTimelineStudent(student)}
                      style={{background:"#fff",borderRadius:14,padding:"12px 16px",border:`1.5px solid ${M}12`,cursor:"pointer",display:"flex",alignItems:"center",gap:12,transition:"all .15s"}}
                      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 6px 20px ${M}18`;}}
                      onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}>
                      <div style={{width:40,height:40,borderRadius:"50%",background:gr?gr.bg:`${M}10`,display:"grid",placeItems:"center",fontSize:20,border:`2px solid ${gr?gr.color+"30":M+"15"}`,flexShrink:0}}>{student.photo}</div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:700,color:"#222"}}>{student.name}</div>
                        <div style={{fontSize:11,color:"#aaa",marginTop:2}}>Roll {student.roll} · {allPcts.length} data point{allPcts.length!==1?"s":""}</div>
                      </div>
                      <div style={{display:"flex",gap:8,alignItems:"center"}}>
                        {trendVal!==null&&<span style={{fontSize:12,fontWeight:700,color:trendVal>0?GREEN:trendVal<0?RED:"#aaa"}}>{trendVal>0?"↑":trendVal<0?"↓":"→"}{Math.abs(trendVal)}%</span>}
                        {gr?<span style={{padding:"4px 12px",borderRadius:20,fontSize:12,fontWeight:800,background:gr.bg,color:gr.color}}>{gr.g}</span>:<span style={{fontSize:11,color:"#ccc"}}>No data</span>}
                      </div>
                      <span style={{fontSize:12,color:M,fontWeight:700}}>→</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}


      {/* ══════════════════ REPORT CARDS ══════════════════ */}
      {tab==="reportcard" && (
        <div>
          {rcStudent ? (()=>{
            const rc=buildRC(rcStudent);
            const og=rc.overall?calcGrade(rc.overall):null;
            const attEntry=(marksDB["attendance"]||{})[rcStudent.id];
            const attPct=attEntry?.pct||null;

            return(
              <div>
                <button onClick={()=>setRcStudent(null)}
                  style={{display:"flex",alignItems:"center",gap:8,marginBottom:16,padding:"8px 16px",borderRadius:10,border:`1.5px solid ${M}25`,background:"transparent",color:M,fontSize:13,fontWeight:600,cursor:"pointer"}}>
                  ← All Students
                </button>

                <div style={{background:"#fff",borderRadius:20,border:`2px solid ${M}25`,overflow:"hidden",boxShadow:"0 8px 32px rgba(0,0,0,0.10)"}}>
                  {/* Header */}
                  <div style={{background:"linear-gradient(135deg,#0D1B2A 0%,#1B2A4A 50%,#162944 100%)",padding:"20px 24px",display:"flex",gap:16,alignItems:"center"}}>
                    <div style={{width:58,height:58,borderRadius:"50%",background:"rgba(255,255,255,0.18)",display:"grid",placeItems:"center",fontSize:30,border:"2px solid rgba(255,255,255,0.3)",flexShrink:0}}>{rcStudent.photo}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:8,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:2,marginBottom:3}}>G.L. International School · Academic Progress Report · 2024–25</div>
                      <div style={{fontSize:20,fontWeight:900,color:"#fff",fontFamily:"Georgia,serif"}}>{rcStudent.name}</div>
                      <div style={{fontSize:12,color:"rgba(255,255,255,0.55)",marginTop:3}}>{cls} – {sec} · Roll {rcStudent.roll} · Class Teacher: Mrs. Priya Nair</div>
                    </div>
                    {og&&(
                      <div style={{padding:"12px 16px",borderRadius:14,background:"rgba(255,255,255,0.12)",textAlign:"center",border:"1px solid rgba(255,255,255,0.2)",flexShrink:0}}>
                        <div style={{fontSize:28,fontWeight:900,color:"#fff",fontFamily:"Georgia,serif"}}>{og.g}</div>
                        <div style={{fontSize:10,color:"rgba(255,255,255,0.5)"}}>Overall</div>
                        <div style={{fontSize:11,color:"rgba(255,255,255,0.7)",fontWeight:700}}>GPA {rc.gpa}</div>
                      </div>
                    )}
                  </div>

                  {/* Rank + Stats strip */}
                  {rc.overall&&(
                    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",borderBottom:`1px solid ${M}12`}}>
                      {[
                        ["Overall",    `${rc.overall}%`,         og.color],
                        ["GPA",         rc.gpa,                  "#1565C0"],
                        ["Class Rank", rc.rank?`#${rc.rank} / ${enteredCount}`:"–",  M      ],
                        ["Percentile", rc.percentile?`${rc.percentile}th`:"–",       PURPLE ],
                      ].map(([l,v,c])=>(
                        <div key={l} style={{padding:"12px 8px",textAlign:"center",borderRight:`1px solid ${M}08`}}>
                          <div style={{fontSize:18,fontWeight:900,color:c,fontFamily:"Georgia,serif"}}>{v}</div>
                          <div style={{fontSize:9,color:"#aaa",textTransform:"uppercase",letterSpacing:0.8,marginTop:2}}>{l}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Strengths & Needs Attention */}
                  {(rc.best||rc.worst)&&(
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0,borderBottom:`1px solid ${M}12`}}>
                      {rc.best&&(
                        <div style={{padding:"12px 16px",background:`${GREEN}06`,borderRight:`1px solid ${M}08`}}>
                          <div style={{fontSize:10,fontWeight:700,color:GREEN,textTransform:"uppercase",letterSpacing:0.8,marginBottom:6}}>🌟 Strongest Subject</div>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <span style={{fontSize:20}}>{rc.best.icon}</span>
                            <div>
                              <div style={{fontSize:13,fontWeight:700,color:"#222"}}>{rc.best.name}</div>
                              <div style={{fontSize:12,fontWeight:900,color:GREEN}}>{rc.best.pct}%</div>
                            </div>
                          </div>
                        </div>
                      )}
                      {rc.worst&&(
                        <div style={{padding:"12px 16px",background:`${ORANGE}06`}}>
                          <div style={{fontSize:10,fontWeight:700,color:ORANGE,textTransform:"uppercase",letterSpacing:0.8,marginBottom:6}}>🎯 Needs Focus</div>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <span style={{fontSize:20}}>{rc.worst.icon}</span>
                            <div>
                              <div style={{fontSize:13,fontWeight:700,color:"#222"}}>{rc.worst.name}</div>
                              <div style={{fontSize:12,fontWeight:900,color:ORANGE}}>{rc.worst.pct}%</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Visual bar chart */}
                  {rc.graded.length>0&&(
                    <div style={{padding:"16px 20px",borderBottom:`1px solid ${M}12`}}>
                      <div style={{fontSize:10,fontWeight:700,color:M,textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>Subject Performance at a Glance</div>
                      {rc.graded.map(sub=>{
                        const gr=calcGrade(sub.pct);
                        const classSubKey=`${cls}-${sec}-${sub.id}-${examType}`;
                        const classSubMarks=marksDB[classSubKey]||{};
                        const vals=EXAM_STUDENTS.map(s=>classSubMarks[s.id]).filter(e=>e&&e.marks!==undefined&&e.marks!=="").map(e=>Number(e.marks)/maxMarks*100);
                        const classSubAvg=vals.length>0?Math.round(vals.reduce((a,b)=>a+b,0)/vals.length):null;
                        return(
                          <div key={sub.id} style={{marginBottom:10}}>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                              <div style={{display:"flex",alignItems:"center",gap:6}}>
                                <span style={{fontSize:14}}>{sub.icon}</span>
                                <span style={{fontSize:12,fontWeight:600,color:"#333"}}>{sub.name}</span>
                              </div>
                              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                                {classSubAvg&&<span style={{fontSize:10,color:"#aaa"}}>Avg: {classSubAvg}%</span>}
                                <span style={{fontSize:12,fontWeight:900,color:gr.color}}>{sub.pct}%</span>
                                <span style={{padding:"1px 7px",borderRadius:10,fontSize:10,fontWeight:700,background:gr.bg,color:gr.color}}>{gr.g}</span>
                              </div>
                            </div>
                            <div style={{background:"#f0e8df",borderRadius:5,height:10,position:"relative"}}>
                              <div style={{width:`${sub.pct}%`,height:"100%",borderRadius:5,background:gr.color,transition:"width 1s ease"}}/>
                              {classSubAvg&&<div style={{position:"absolute",top:0,left:`${classSubAvg}%`,width:2,height:"100%",background:"rgba(0,0,0,0.25)",borderRadius:1}}/>}
                            </div>
                            {classSubAvg&&<div style={{fontSize:9,color:"#aaa",marginTop:2}}>│ = Class average ({classSubAvg}%)</div>}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Subject-wise exam breakdown */}
                  <div style={{padding:"0"}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 100px 70px 50px",padding:"9px 20px",background:"#F0E8DF"}}>
                      {["Subject / Exam Breakdown","Exams","Score","Grade"].map((h,i)=>(
                        <div key={h} style={{fontSize:10,fontWeight:700,color:M,textTransform:"uppercase",letterSpacing:0.6,textAlign:i>0?"center":"left"}}>{h}</div>
                      ))}
                    </div>
                    {rc.subjects.map((sub,i)=>{
                      const gr=sub.pct!==null?calcGrade(sub.pct):null;
                      return(
                        <div key={sub.id} style={{borderBottom:i<rc.subjects.length-1?`1px solid #F5EDE3`:"none"}}>
                          <div style={{display:"grid",gridTemplateColumns:"1fr 100px 70px 50px",padding:"11px 20px",background:i%2===0?"#fff":"#FAFAF8",alignItems:"center"}}>
                            <div style={{display:"flex",alignItems:"center",gap:8}}>
                              <span style={{fontSize:16}}>{sub.icon}</span>
                              <div>
                                <div style={{fontSize:13,fontWeight:600,color:"#222"}}>{sub.name}</div>
                                {sub.pct!==null&&sub.exams.map(e=>(
                                  <span key={e.et} style={{fontSize:9,marginRight:4,padding:"1px 5px",borderRadius:8,background:`${M}10`,color:M,fontWeight:600}}>{e.et}: {e.marks}/{e.max} ({e.pct}%)</span>
                                ))}
                              </div>
                            </div>
                            <div style={{textAlign:"center",fontSize:12,color:"#888"}}>{sub.exams.length||"–"}</div>
                            <div style={{textAlign:"center"}}>
                              {sub.pct!==null?<span style={{fontSize:13,fontWeight:700,color:gr.color}}>{sub.pct}%</span>:<span style={{color:"#ddd"}}>–</span>}
                            </div>
                            <div style={{textAlign:"center"}}>
                              {gr?<span style={{padding:"2px 9px",borderRadius:20,fontSize:12,fontWeight:800,background:gr.bg,color:gr.color}}>{gr.g}</span>:<span style={{color:"#ddd"}}>–</span>}
                            </div>
                          </div>
                          {sub.exams.length>0&&sub.exams.some(e=>e.remark)&&(
                            <div style={{padding:"4px 20px 10px 48px",background:i%2===0?"#fff":"#FAFAF8"}}>
                              {sub.exams.filter(e=>e.remark).map(e=>(
                                <div key={e.et} style={{fontSize:11,color:"#888",fontStyle:"italic"}}>"{e.et}: {e.remark}"</div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Teacher Remarks */}
                  <div style={{padding:"14px 20px",background:`${M}06`,borderTop:`1px solid ${M}15`}}>
                    <div style={{fontSize:10,fontWeight:700,color:M,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>👩‍🏫 Class Teacher's Overall Remark</div>
                    <div style={{fontSize:13,color:"#444",lineHeight:1.7,fontStyle:"italic",background:"#fff",padding:"10px 14px",borderRadius:10,border:`1px solid ${M}15`}}>
                      {rc.overall>=75
                        ? `${rcStudent.name} is performing commendably. ${rc.best?`Especially strong in ${rc.best.name}.`:""} ${rc.worst&&rc.worst.pct<60?`Can improve further in ${rc.worst.name}.`:""} Keep up the excellent work.`
                        : rc.overall>=50
                        ? `${rcStudent.name} shows satisfactory progress. ${rc.best?`Performing well in ${rc.best.name}.`:""} ${rc.worst?`Dedicated effort needed in ${rc.worst.name}.`:""} With consistent study, performance can improve significantly.`
                        : `${rcStudent.name} requires additional attention and support. ${rc.worst?`Focus especially on ${rc.worst.name}.`:""} Regular revision and parent involvement is strongly recommended.`
                      }
                    </div>
                  </div>

                  {/* Grading legend + signatures */}
                  <div style={{padding:"14px 20px",background:"#F9F4EE",borderTop:`1px solid ${M}12`}}>
                    <div style={{fontSize:10,color:"#aaa",textTransform:"uppercase",letterSpacing:1,marginBottom:8,fontWeight:700}}>Grading Scale</div>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
                      {[["A+","≥90"],["A","80–89"],["B+","70–79"],["B","60–69"],["C","50–59"],["D","33–49"],["F","<33"]].map(([g,r])=>{
                        const gr=calcGrade(g==="A+"?95:g==="A"?85:g==="B+"?75:g==="B"?65:g==="C"?55:g==="D"?40:20);
                        return <span key={g} style={{fontSize:10,padding:"3px 9px",borderRadius:10,background:gr.bg,color:gr.color,fontWeight:700}}>{g}: {r}</span>;
                      })}
                    </div>
                    {/* Signature section */}
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
                      {["Class Teacher","Principal","Parent / Guardian"].map(s=>(
                        <div key={s} style={{textAlign:"center"}}>
                          <div style={{height:36,borderBottom:"1.5px solid #ccc",marginBottom:6}}/>
                          <div style={{fontSize:10,color:"#888",fontWeight:600}}>{s}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div style={{padding:"10px 20px",background:"linear-gradient(135deg,#0D1B2A,#162944)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{fontSize:10,color:"rgba(255,255,255,0.4)"}}>Generated: {new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})}</div>
                    <div style={{fontSize:10,color:"rgba(255,255,255,0.4)"}}>G.L. International School — Confidential</div>
                  </div>
                </div>

                {/* Print button */}
                <button onClick={()=>window.print()} style={{width:"100%",marginTop:14,padding:"13px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#0D1B2A,#162944)",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",boxShadow:"0 6px 20px rgba(13,27,42,0.35)",display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
                  🖨️ Print / Download PDF
                </button>
              </div>
            );
          })() : (
            <div>
              <div style={{fontSize:11,fontWeight:700,color:M,textTransform:"uppercase",letterSpacing:1.5,marginBottom:14}}>Select a student to view their report card</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {EXAM_STUDENTS.map(student=>{
                  const rc=buildRC(student);
                  const hasData=rc.overall!==null;
                  const gr=hasData?calcGrade(rc.overall):null;
                  return(
                    <div key={student.id} onClick={()=>setRcStudent(student)}
                      style={{background:"#fff",borderRadius:14,padding:"12px 16px",border:`1.5px solid ${M}12`,cursor:"pointer",display:"flex",alignItems:"center",gap:12,transition:"all .15s"}}
                      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 6px 20px ${M}18`;}}
                      onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}>
                      <div style={{width:40,height:40,borderRadius:"50%",background:gr?gr.bg:`${M}10`,display:"grid",placeItems:"center",fontSize:20,border:`2px solid ${gr?gr.color+"30":M+"15"}`,flexShrink:0}}>{student.photo}</div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:700,color:"#222"}}>{student.name}</div>
                        <div style={{fontSize:11,color:"#aaa",marginTop:2}}>Roll {student.roll} · {rc.graded.length}/{SUBJECTS_CONFIG.length} subjects</div>
                      </div>
                      {hasData?(
                        <div style={{display:"flex",gap:8,alignItems:"center"}}>
                          {rc.rank&&<span style={{fontSize:11,color:"#aaa"}}>#{rc.rank}</span>}
                          <div style={{textAlign:"center"}}>
                            <div style={{fontSize:14,fontWeight:900,color:gr.color}}>{rc.overall}%</div>
                          </div>
                          <span style={{padding:"3px 11px",borderRadius:20,fontSize:12,fontWeight:800,background:gr.bg,color:gr.color}}>{gr.g}</span>
                        </div>
                      ):<span style={{fontSize:11,color:"#ddd"}}>No marks yet</span>}
                      <span style={{fontSize:12,color:M,fontWeight:700}}>→</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


function AdmAttendance() {
  const [view, setView] = useState("today");
  const classData = [
    { cls: "Nursery", total: 45, present: 42, teacher: "Mrs. Anjali" },
    { cls: "LKG",     total: 52, present: 48, teacher: "Mrs. Kavitha" },
    { cls: "UKG",     total: 55, present: 50, teacher: "Mrs. Rekha"   },
    { cls: "Class 1", total: 60, present: 56, teacher: "Mr. Suresh"   },
    { cls: "Class 2", total: 58, present: 52, teacher: "Mrs. Geeta"   },
    { cls: "Class 3", total: 58, present: 54, teacher: "Mrs. Priya"   },
    { cls: "Class 4", total: 55, present: 51, teacher: "Mr. Rohit"    },
    { cls: "Class 5", total: 50, present: 46, teacher: "Mrs. Seema"   },
  ];
  const totalStudents = classData.reduce((a, c) => a + c.total, 0);
  const totalPresent  = classData.reduce((a, c) => a + c.present, 0);
  const totalAbsent   = totalStudents - totalPresent;

  const weekTrend = [
    { day: "Mon", present: 356 }, { day: "Tue", present: 349 }, { day: "Wed", present: 361 },
    { day: "Thu", present: 358 }, { day: "Fri", present: 359 },
  ];

  return (
    <div style={{ paddingBottom: 32 }}>
      <div style={{ background: `linear-gradient(135deg, ${MD} 0%, ${BLUE} 100%)`, borderRadius: 16, padding: "16px 20px", marginBottom: 20, boxShadow: `0 8px 24px ${BLUE}44` }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", fontFamily: "Georgia,serif", marginBottom: 10 }}>📅 Student Attendance</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
          {[["Present", totalPresent, GREEN], ["Absent", totalAbsent, RED], ["Rate", `${Math.round(totalPresent/totalStudents*100)}%`, "#fff"]].map(([l,v,c]) => (
            <div key={l} style={{ padding: "10px", borderRadius: 12, background: "rgba(255,255,255,0.15)", textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>{v}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.65)", marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* View toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[["today","Today's Summary"],["trend","Weekly Trend"]].map(([v,l]) => (
          <button key={v} onClick={() => setView(v)}
            style={{ padding: "8px 18px", borderRadius: 20, border: "none", background: view === v ? M : "#eee", color: view === v ? "#fff" : "#666", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{l}</button>
        ))}
      </div>

      {view === "today" && (
        <div style={{ background: MC, borderRadius: 16, padding: "16px 18px", border: `1px solid ${M}12` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>Class-wise Attendance</div>
          {classData.map((c, i) => {
            const pct = Math.round(c.present / c.total * 100);
            const absent = c.total - c.present;
            return (
              <div key={c.cls} style={{ marginBottom: i < classData.length - 1 ? 14 : 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#222" }}>{c.cls}</span>
                    <span style={{ fontSize: 10, color: "#aaa", marginLeft: 8 }}>{c.teacher}</span>
                  </div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    {absent > 0 && <span style={{ fontSize: 11, color: RED, fontWeight: 600 }}>{absent} absent</span>}
                    <span style={{ fontSize: 11, fontWeight: 800, color: pct >= 90 ? GREEN : pct >= 80 ? TEAL : ORANGE }}>{pct}%</span>
                  </div>
                </div>
                <div style={{ background: "#f0e8df", borderRadius: 5, height: 8 }}>
                  <div style={{ width: `${pct}%`, height: "100%", borderRadius: 5, background: pct >= 90 ? GREEN : pct >= 80 ? TEAL : ORANGE, transition: "width 1s ease" }} />
                </div>
                {i < classData.length - 1 && <div style={{ height: 1, background: "#f0e8df", marginTop: 12 }} />}
              </div>
            );
          })}
        </div>
      )}

      {view === "trend" && (
        <div style={{ background: MC, borderRadius: 16, padding: "16px 18px", border: `1px solid ${M}12` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>This Week's Trend</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weekTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0e8df" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} />
              <YAxis domain={[330, 375]} tick={{ fontSize: 10, fill: "#ccc" }} axisLine={false} tickLine={false} width={34} />
              <Tooltip content={<CTip />} />
              <Area type="monotone" dataKey="present" stroke={BLUE} fill={BLUE + "22"} strokeWidth={2.5} dot={{ fill: BLUE, r: 4 }} name="Students Present" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function AdmStaff() {
  const [leaveFilter, setLeaveFilter] = useState("All");
  const staffLeave = [
    { name: "Mr. Suresh Iyer",    dept: "Class 1",  type: "Sick Leave",    from: "Mar 10", to: "Mar 11", days: 2, status: "Approved"  },
    { name: "Mrs. Kavitha Nair",  dept: "LKG",      type: "Casual Leave",  from: "Mar 12", to: "Mar 12", days: 1, status: "Pending"   },
    { name: "Mr. Rohit Sharma",   dept: "Class 4",  type: "Sick Leave",    from: "Mar 8",  to: "Mar 9",  days: 2, status: "Approved"  },
    { name: "Mrs. Seema Gupta",   dept: "Class 5",  type: "Casual Leave",  from: "Mar 14", to: "Mar 14", days: 1, status: "Pending"   },
    { name: "Mr. Ramesh Kumar",   dept: "Admin",    type: "Emergency",     from: "Mar 7",  to: "Mar 7",  days: 1, status: "Approved"  },
    { name: "Mrs. Anjali Mehta",  dept: "Nursery",  type: "Earned Leave",  from: "Mar 20", to: "Mar 22", days: 3, status: "Pending"   },
  ];

  const deptAttendance = [
    { dept: "Teaching Staff",  total: 32, present: 29, color: M      },
    { dept: "Admin Staff",     total: 8,  present: 7,  color: BLUE   },
    { dept: "Support Staff",   total: 8,  present: 7,  color: GREEN  },
  ];

  const statuses = ["All", "Pending", "Approved"];
  const filtered = leaveFilter === "All" ? staffLeave : staffLeave.filter(s => s.status === leaveFilter);

  const [requests, setRequests] = useState(staffLeave.map((s, i) => ({ ...s, id: i })));
  const updateLeave = (id, status) => setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  const filteredReqs = leaveFilter === "All" ? requests : requests.filter(r => r.status === leaveFilter);

  return (
    <div style={{ paddingBottom: 32 }}>
      {/* Staff Attendance Summary */}
      <div style={{ background: `linear-gradient(135deg, ${MD} 0%, ${PURPLE} 100%)`, borderRadius: 16, padding: "16px 20px", marginBottom: 20, boxShadow: `0 8px 24px ${PURPLE}44` }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", fontFamily: "Georgia,serif", marginBottom: 12 }}>👨‍💼 Staff Attendance & Leave</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {deptAttendance.map(d => {
            const pct = Math.round(d.present / d.total * 100);
            return (
              <div key={d.dept}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>{d.dept}</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>{d.present}/{d.total} · {pct}%</span>
                </div>
                <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 5, height: 8 }}>
                  <div style={{ width: `${pct}%`, height: "100%", borderRadius: 5, background: "#fff", transition: "width 1s ease" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leave requests */}
      <div style={{ background: MC, borderRadius: 16, padding: "16px 18px", border: `1px solid ${M}12` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: 1.5 }}>Leave Applications</div>
          <div style={{ display: "flex", gap: 6 }}>
            {statuses.map(s => (
              <button key={s} onClick={() => setLeaveFilter(s)}
                style={{ padding: "4px 12px", borderRadius: 20, border: "none", background: leaveFilter === s ? M : "#eee", color: leaveFilter === s ? "#fff" : "#666", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>{s}</button>
            ))}
          </div>
        </div>
        {filteredReqs.map((r, i) => {
          const isPending = r.status === "Pending";
          return (
            <div key={r.id} style={{ padding: "12px 14px", borderRadius: 12, background: isPending ? "#FFF8E1" : "#F5F5F5", border: `1px solid ${isPending ? ORANGE : "#e0e0e0"}20`, marginBottom: i < filteredReqs.length - 1 ? 10 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#222" }}>{r.name}</div>
                  <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{r.dept} · {r.type}</div>
                  <div style={{ fontSize: 11, color: "#555", marginTop: 3 }}>📅 {r.from} – {r.to} · {r.days} day{r.days > 1 ? "s" : ""}</div>
                </div>
                <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                  background: isPending ? "#FFF3E0" : "#E8F5E9", color: isPending ? ORANGE : GREEN }}>{r.status}</span>
              </div>
              {isPending && (
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <button onClick={() => updateLeave(r.id, "Approved")}
                    style={{ flex: 1, padding: "7px", borderRadius: 8, border: "none", background: GREEN, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>✅ Approve</button>
                  <button onClick={() => updateLeave(r.id, "Rejected")}
                    style={{ flex: 1, padding: "7px", borderRadius: 8, border: "none", background: "#eee", color: RED, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>❌ Reject</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AdmNotices() {
  const [notices, setNotices] = useState([
    { id: 1, title: "Parent-Teacher Meeting", body: "PTM scheduled for March 14 from 9 AM – 1 PM. All class teachers must be present.", date: "Mar 9", by: "Principal", type: "Important", audience: "All" },
    { id: 2, title: "Unit Test Schedule – Class 3 to 5", body: "Unit tests will be conducted from March 15–20. Timetable shared separately.", date: "Mar 8", by: "Coordinator", type: "Exam", audience: "Classes 3–5" },
    { id: 3, title: "Staff Meeting – Friday 3 PM", body: "All teaching staff are required to attend the monthly staff meeting on Friday.", date: "Mar 7", by: "Principal", type: "Staff", audience: "Staff" },
    { id: 4, title: "Fee Payment Reminder", body: "Term 3 fee due date is March 15. Parents are requested to pay on time.", date: "Mar 6", by: "Accounts", type: "Fee", audience: "Parents" },
    { id: 5, title: "Annual Function Rehearsal", body: "Rehearsals for the Annual Function will begin from March 18. Shortlisted students to report to the auditorium.", date: "Mar 5", by: "Coordinator", type: "Event", audience: "Selected Students" },
  ]);
  const [form, setForm] = useState({ title: "", body: "", type: "General", audience: "All" });
  const [sheetOpen, setSheetOpen] = useState(false);

  const typeColor = t => ({ "Important": RED, "Exam": PURPLE, "Staff": BLUE, "Fee": ORANGE, "Event": GREEN, "General": M })[t] || M;

  const post = () => {
    if (!form.title.trim() || !form.body.trim()) return;
    setNotices(prev => [{ id: Date.now(), ...form, date: "Today", by: "Admin" }, ...prev]);
    setForm({ title: "", body: "", type: "General", audience: "All" });
    setSheetOpen(false);
  };

  return (
    <div style={{ paddingBottom: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: M, fontFamily: "Georgia,serif" }}>📢 Notices & Circulars</div>
          <div style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>Post and manage school communications</div>
        </div>
        <button onClick={() => setSheetOpen(true)}
          style={{ padding: "10px 18px", borderRadius: 10, border: "none", background: `linear-gradient(135deg,${M},${MD})`, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: `0 4px 14px ${M}44` }}>
          + Post Notice
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {notices.map(n => (
          <div key={n.id} style={{ background: MC, borderRadius: 14, padding: "14px 16px", border: `1.5px solid ${typeColor(n.type)}22` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#222", marginBottom: 4 }}>{n.title}</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ padding: "2px 10px", borderRadius: 20, background: `${typeColor(n.type)}15`, color: typeColor(n.type), fontSize: 10, fontWeight: 700 }}>{n.type}</span>
                  <span style={{ padding: "2px 10px", borderRadius: 20, background: "#f5f5f5", color: "#666", fontSize: 10 }}>👥 {n.audience}</span>
                  <span style={{ padding: "2px 10px", borderRadius: 20, background: "#f5f5f5", color: "#aaa", fontSize: 10 }}>👤 {n.by}</span>
                </div>
              </div>
              <div style={{ fontSize: 11, color: "#aaa", flexShrink: 0, marginLeft: 10 }}>📅 {n.date}</div>
            </div>
            <div style={{ fontSize: 12, color: "#555", lineHeight: 1.6, padding: "10px 12px", borderRadius: 8, background: "#FAFAF8", border: "1px solid #f0e8df" }}>{n.body}</div>
          </div>
        ))}
      </div>

      <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Post New Notice">
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>Title</div>
          <input placeholder="Notice title..." value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={cardInput} />
        </div>
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>Message</div>
          <textarea placeholder="Write the notice content here..." rows={4} value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} style={{ ...cardInput, resize: "none", lineHeight: 1.6 }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>Type</div>
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={{ ...cardInput, marginBottom: 0 }}>
              {["General","Important","Exam","Staff","Fee","Event"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>Audience</div>
            <select value={form.audience} onChange={e => setForm(f => ({ ...f, audience: e.target.value }))} style={{ ...cardInput, marginBottom: 0 }}>
              {["All","Parents","Staff","Classes 1–5","Selected Students"].map(a => <option key={a}>{a}</option>)}
            </select>
          </div>
        </div>
        <button onClick={post} disabled={!form.title.trim() || !form.body.trim()}
          style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: (!form.title.trim() || !form.body.trim()) ? "#ddd" : `linear-gradient(135deg,${M},${MD})`, color: (!form.title.trim() || !form.body.trim()) ? "#aaa" : "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
          Publish Notice →
        </button>
      </Sheet>
    </div>
  );
}

function AdmExams() {
  const exams = [
    { subject: "Mathematics",  class: "Class 3", date: "Mar 15", time: "9:00 AM", duration: "2 hrs", invigilator: "Mr. Suresh",  status: "Scheduled", maxMarks: 100 },
    { subject: "Science",      class: "Class 3", date: "Mar 17", time: "9:00 AM", duration: "2 hrs", invigilator: "Mrs. Priya",  status: "Scheduled", maxMarks: 100 },
    { subject: "English",      class: "Class 4", date: "Mar 15", time: "11:00 AM",duration: "2 hrs", invigilator: "Mrs. Seema",  status: "Scheduled", maxMarks: 100 },
    { subject: "Mathematics",  class: "Class 5", date: "Mar 16", time: "9:00 AM", duration: "2 hrs", invigilator: "Mr. Rohit",   status: "Scheduled", maxMarks: 100 },
    { subject: "Hindi",        class: "Class 2", date: "Mar 18", time: "9:00 AM", duration: "1.5 hrs",invigilator: "Mrs. Geeta", status: "Scheduled", maxMarks: 80  },
    { subject: "Social Sc.",   class: "Class 5", date: "Mar 20", time: "11:00 AM",duration: "2 hrs", invigilator: "Mrs. Seema",  status: "Scheduled", maxMarks: 100 },
  ];

  const recentResults = [
    { subject: "Mathematics", class: "Class 3", avg: 76, highest: 95, lowest: 42, passed: 52, total: 58 },
    { subject: "English",     class: "Class 3", avg: 82, highest: 97, lowest: 51, passed: 55, total: 58 },
    { subject: "Science",     class: "Class 4", avg: 74, highest: 91, lowest: 38, passed: 49, total: 55 },
  ];

  return (
    <div style={{ paddingBottom: 32 }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: M, fontFamily: "Georgia,serif", marginBottom: 4 }}>📝 Exams & Results</div>
      <div style={{ fontSize: 12, color: "#aaa", marginBottom: 20 }}>Upcoming exams and recent result summaries</div>

      {/* Upcoming Exams */}
      <div style={{ background: MC, borderRadius: 16, padding: "16px 18px", marginBottom: 18, border: `1px solid ${M}12` }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>📅 Upcoming Exams — March 2025</div>
        {exams.map((e, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: i < exams.length - 1 ? "1px solid #f0e8df" : "none" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: `${PURPLE}12`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: PURPLE }}>{e.date.split(" ")[1]}</div>
                <div style={{ fontSize: 9, color: "#aaa" }}>{e.date.split(" ")[0]}</div>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#222" }}>{e.subject} <span style={{ color: "#aaa", fontWeight: 400, fontSize: 11 }}>— {e.class}</span></div>
                <div style={{ fontSize: 11, color: "#888" }}>{e.time} · {e.duration} · Invigilator: {e.invigilator}</div>
              </div>
            </div>
            <span style={{ padding: "3px 10px", borderRadius: 20, background: "#E3F2FD", color: BLUE, fontSize: 10, fontWeight: 700 }}>{e.maxMarks} marks</span>
          </div>
        ))}
      </div>

      {/* Recent Results */}
      <div style={{ background: MC, borderRadius: 16, padding: "16px 18px", border: `1px solid ${M}12` }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>📊 Recent Results Summary</div>
        {recentResults.map((r, i) => {
          const passPct = Math.round(r.passed / r.total * 100);
          return (
            <div key={i} style={{ padding: "14px", borderRadius: 12, background: "#FAFAF8", border: "1px solid #f0e8df", marginBottom: i < recentResults.length - 1 ? 10 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#222" }}>{r.subject} <span style={{ color: "#aaa", fontWeight: 400 }}>— {r.class}</span></div>
                  <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{r.total} students appeared</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: M }}>Avg {r.avg}%</div>
                  <div style={{ fontSize: 10, color: "#aaa", marginTop: 1 }}>Class average</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                {[["🏆 Highest", r.highest, GREEN],["⬇ Lowest", r.lowest, RED],[`✅ ${passPct}% Passed`, `${r.passed}/${r.total}`, TEAL]].map(([l,v,c]) => (
                  <div key={l} style={{ padding: "8px", borderRadius: 8, background: `${c}10`, textAlign: "center" }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: c }}>{v}</div>
                    <div style={{ fontSize: 9, color: "#aaa", marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AdmAdmissions() {
  const inquiries = [
    { name: "Riya Patel",    class: "Class 1", parent: "Mr. Patel",    phone: "98765XXXXX", date: "Mar 9",  status: "New"        },
    { name: "Aman Sinha",    class: "LKG",     parent: "Mrs. Sinha",   phone: "87654XXXXX", date: "Mar 8",  status: "Documents"  },
    { name: "Pooja Verma",   class: "Class 2", parent: "Mr. Verma",    phone: "76543XXXXX", date: "Mar 7",  status: "Interview"  },
    { name: "Karan Mehta",   class: "UKG",     parent: "Mrs. Mehta",   phone: "65432XXXXX", date: "Mar 6",  status: "Enrolled"   },
    { name: "Sara Shah",     class: "Class 3", parent: "Mr. Shah",     phone: "54321XXXXX", date: "Mar 5",  status: "New"        },
    { name: "Dev Joshi",     class: "Class 1", parent: "Mrs. Joshi",   phone: "43210XXXXX", date: "Mar 4",  status: "Documents"  },
    { name: "Nisha Kumar",   class: "Nursery", parent: "Mr. Kumar",    phone: "32109XXXXX", date: "Mar 3",  status: "Enrolled"   },
  ];

  const statusColor = s => ({ "New": BLUE, "Documents": ORANGE, "Interview": PURPLE, "Enrolled": GREEN, "Rejected": RED })[s] || M;

  const stats = ["New","Documents","Interview","Enrolled"].map(s => ({ label: s, count: inquiries.filter(i => i.status === s).length }));

  return (
    <div style={{ paddingBottom: 32 }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: M, fontFamily: "Georgia,serif", marginBottom: 4 }}>📈 Admissions Tracker</div>
      <div style={{ fontSize: 12, color: "#aaa", marginBottom: 20 }}>Current inquiry pipeline — 2025–26 session</div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 18 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: MC, borderRadius: 13, padding: "12px 10px", border: `1px solid ${statusColor(s.label)}20`, textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: statusColor(s.label) }}>{s.count}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: statusColor(s.label), textTransform: "uppercase", letterSpacing: 0.8, marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Inquiry list */}
      <div style={{ background: MC, borderRadius: 16, padding: "16px 18px", border: `1px solid ${M}12` }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: M, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>All Inquiries</div>
        {inquiries.map((inq, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: i < inquiries.length - 1 ? "1px solid #f0e8df" : "none" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${statusColor(inq.status)}15`, display: "grid", placeItems: "center", fontSize: 14, fontWeight: 800, color: statusColor(inq.status) }}>
                {inq.name[0]}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#222" }}>{inq.name}</div>
                <div style={{ fontSize: 11, color: "#888" }}>For {inq.class} · {inq.parent} · {inq.date}</div>
              </div>
            </div>
            <span style={{ padding: "3px 12px", borderRadius: 20, background: `${statusColor(inq.status)}15`, color: statusColor(inq.status), fontSize: 11, fontWeight: 700 }}>{inq.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdmDefaulters() {
  const [filterClass, setFilterClass] = useState("All");

  const defaulters = [
    { name: "Aryan Mehta",    cls: "Class 1", amount: 12000, days: 42, parent: "Mr. Mehta",    phone: "98765XXXXX" },
    { name: "Kavya Singh",    cls: "Class 3", amount: 8200,  days: 38, parent: "Mrs. Singh",   phone: "87654XXXXX" },
    { name: "Rahul Verma",    cls: "Class 1", amount: 11000, days: 35, parent: "Mr. Verma",    phone: "76543XXXXX" },
    { name: "Pooja Nair",     cls: "Class 5", amount: 9500,  days: 32, parent: "Mrs. Nair",    phone: "65432XXXXX" },
    { name: "Sameer Khan",    cls: "Class 2", amount: 7500,  days: 28, parent: "Mr. Khan",     phone: "54321XXXXX" },
    { name: "Tanya Patel",    cls: "Class 4", amount: 13000, days: 27, parent: "Mrs. Patel",   phone: "43210XXXXX" },
    { name: "Dev Sharma",     cls: "Class 5", amount: 8800,  days: 24, parent: "Mr. Sharma",   phone: "32109XXXXX" },
    { name: "Riya Joshi",     cls: "Nursery", amount: 6500,  days: 21, parent: "Mrs. Joshi",   phone: "21098XXXXX" },
    { name: "Aakash Gupta",   cls: "Class 2", amount: 9200,  days: 18, parent: "Mr. Gupta",    phone: "10987XXXXX" },
    { name: "Neha Iyer",      cls: "Class 3", amount: 7800,  days: 15, parent: "Mrs. Iyer",    phone: "09876XXXXX" },
    { name: "Rohan Das",      cls: "UKG",     amount: 5500,  days: 12, parent: "Mr. Das",      phone: "98760XXXXX" },
    { name: "Simran Kaur",    cls: "Class 4", amount: 10500, days: 10, parent: "Mrs. Kaur",    phone: "87651XXXXX" },
  ];

  const classes = ["All", "Nursery", "UKG", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5"];
  const filtered = filterClass === "All" ? defaulters : defaulters.filter(d => d.cls === filterClass);

  const totalPending  = defaulters.reduce((a, d) => a + d.amount, 0);
  const urgentCount   = defaulters.filter(d => d.days >= 30).length;

  const urgencyColor = days => days >= 30 ? RED : days >= 20 ? ORANGE : "#888";
  const urgencyLabel = days => days >= 30 ? "Critical" : days >= 20 ? "Urgent" : "Due";
  const urgencyBg    = days => days >= 30 ? "#FFEBEE" : days >= 20 ? "#FFF3E0" : "#F5F5F5";

  const sendWhatsApp = (d) => {
    const msg = encodeURIComponent(`Dear ${d.parent}, this is a reminder from G.L. International School regarding the pending fee of ₹${d.amount.toLocaleString()} for ${d.name} (${d.cls}). The amount has been due for ${d.days} days. Kindly clear the dues at the earliest. Thank you.`);
    window.open(`https://wa.me/91${d.phone.replace(/X/g,'')}?text=${msg}`, "_blank");
  };

  return (
    <div style={{ paddingBottom: 32 }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, #B71C1C 0%, ${RED} 60%, #E53935 100%)`, borderRadius: 16, padding: "16px 20px", marginBottom: 20, boxShadow: `0 8px 24px ${RED}44` }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", fontFamily: "Georgia,serif", marginBottom: 12 }}>⚠️ Fee Defaulters</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
          {[
            ["Total Defaulters", defaulters.length, "students"],
            ["Total Pending",    `₹${(totalPending/1000).toFixed(0)}K`, "amount due"],
            ["Critical (>30d)",  urgentCount, "need action"],
          ].map(([l,v,s]) => (
            <div key={l} style={{ padding: "10px 8px", borderRadius: 12, background: "rgba(255,255,255,0.15)", textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#fff" }}>{v}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.7)", marginTop: 2, textTransform: "uppercase", letterSpacing: 0.8 }}>{l}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", marginTop: 1 }}>{s}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter by class */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#aaa", marginBottom: 8, fontWeight: 600 }}>Filter by Class</div>
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          {classes.map(c => (
            <button key={c} onClick={() => setFilterClass(c)}
              style={{ padding: "5px 14px", borderRadius: 20, border: "none", background: filterClass === c ? M : "#eee", color: filterClass === c ? "#fff" : "#555", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Defaulters list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map((d, i) => (
          <div key={i} style={{ background: MC, borderRadius: 14, padding: "14px 16px", border: `1.5px solid ${urgencyColor(d.days)}20` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: `${urgencyColor(d.days)}15`, display: "grid", placeItems: "center", fontSize: 15, fontWeight: 800, color: urgencyColor(d.days), flexShrink: 0 }}>
                  {d.name[0]}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#222" }}>{d.name}</div>
                  <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{d.cls} · Parent: {d.parent}</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 16, fontWeight: 900, color: urgencyColor(d.days) }}>₹{d.amount.toLocaleString()}</div>
                <span style={{ padding: "2px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: urgencyBg(d.days), color: urgencyColor(d.days) }}>
                  {d.days}d · {urgencyLabel(d.days)}
                </span>
              </div>
            </div>

            {/* Overdue bar */}
            <div style={{ background: "#f0e8df", borderRadius: 4, height: 5, marginBottom: 10 }}>
              <div style={{ width: `${Math.min(d.days / 45 * 100, 100)}%`, height: "100%", borderRadius: 4, background: urgencyColor(d.days), transition: "width 1s ease" }} />
            </div>

            {/* Action */}
            <button onClick={() => sendWhatsApp(d)}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "9px", borderRadius: 9, border: "none", background: "#E8F5E9", color: "#2E7D32", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
              <span style={{ fontSize: 16 }}>💬</span> Send WhatsApp Reminder to {d.parent}
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: "#ccc", fontSize: 13 }}>No defaulters in this class 🎉</div>
        )}
      </div>
    </div>
  );
}

function LoginScreen({ onSuccess, role, setRole, subRole, setSubRole }) {
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("password");
  const adminSubRoles = [
    { value: "principal",   label: "Principal",          icon: "🎓" },
    { value: "accounts",    label: "Accounts / Finance", icon: "💰" },
    { value: "coordinator", label: "Coordinator",        icon: "📋" },
  ];
  const portalLabel = role === "admin" ? "Chairman's Portal"
    : role === "administration" ? "Administration Portal"
    : role === "teacher" ? "Teacher Portal"
    : "Parent Portal";

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: `radial-gradient(ellipse at 60% 40%, ${MB} 0%, #EDD9C8 100%)` }}>
      <div style={{ padding: 32, borderRadius: 20, width: 380, background: MC, boxShadow: `0 20px 60px ${M}25`, border: `1px solid ${M}20` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
          <Crest size={50} />
          <div>
            <div style={{ fontWeight: 700, color: M, fontSize: 15, fontFamily: "Georgia,serif" }}>G.L. International School</div>
            <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{portalLabel}</div>
          </div>
        </div>

        {/* Portal selector */}
        <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Select Portal</div>
        <select value={role} onChange={e => { setRole(e.target.value); setSubRole("principal"); }} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, marginBottom: 14, background: MB, border: `1.5px solid ${M}30`, fontSize: 13, color: "#222" }}>
          <option value="parent">Parent</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Chairman</option>
          <option value="administration">Administration</option>
        </select>

        {/* Sub-role selector — only for Administration */}
        {role === "administration" && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Select Your Role</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {adminSubRoles.map(r => (
                <button key={r.value} onClick={() => setSubRole(r.value)}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 10, border: `2px solid ${subRole === r.value ? M : "#e0d6cc"}`, background: subRole === r.value ? `${M}10` : "transparent", cursor: "pointer", textAlign: "left" }}>
                  <span style={{ fontSize: 18 }}>{r.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: subRole === r.value ? M : "#555" }}>{r.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Login mode toggle */}
        <div style={{ display: "flex", marginBottom: 16, borderRadius: 10, overflow: "hidden", border: `1.5px solid ${M}30` }}>
          {["password","otp"].map(m => <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: "8px", fontSize: 13, border: "none", cursor: "pointer", background: mode === m ? M : "transparent", color: mode === m ? "#fff" : "#333", fontWeight: mode === m ? 700 : 400 }}>{m === "password" ? "Password" : "OTP"}</button>)}
        </div>
        {mode === "password" && <><input placeholder="User ID" style={{ ...cardInput }} /><div style={{ display: "flex", borderRadius: 10, border: `1.5px solid ${M}25`, background: MB, marginBottom: 16 }}><input type={show ? "text" : "password"} placeholder="Password" style={{ flex: 1, padding: "10px 14px", border: "none", background: "transparent", fontSize: 13 }} /><button onClick={() => setShow(!show)} style={{ padding: "0 12px", background: "none", border: "none", cursor: "pointer", color: "#888" }}>{show ? "🙈" : "👁"}</button></div></>}
        {mode === "otp" && <><input placeholder="Mobile Number" style={{ ...cardInput }} /><button style={{ width: "100%", padding: "10px", borderRadius: 10, marginBottom: 10, border: `1.5px solid ${M}40`, background: "transparent", color: M, fontSize: 13, cursor: "pointer" }}>🔑 Send OTP</button><input placeholder="Enter OTP" style={{ ...cardInput }} /></>}
        <button onClick={onSuccess} style={{ width: "100%", padding: "13px", borderRadius: 10, border: "none", background: `linear-gradient(135deg,${M},${MD})`, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: `0 6px 20px ${M}44` }}>Login →</button>
        <div style={{ textAlign: "center", marginTop: 12, fontSize: 11, color: "#aaa" }}>🔒 Secure Login</div>
      </div>
    </div>
  );
}

export default function GLISApp() {
  const [authed, setAuthed]   = useState(false);
  const [role, setRole]       = useState("admin");
  const [subRole, setSubRole] = useState("principal");
  const [tab, setTab]         = useState("");
  const [payOpen, setPayOpen] = useState(false);
  const [payData, setPayData] = useState({ amount: 25000, term: "Term 3" });
  const openPay = useCallback((amount = 25000, term = "Term 3") => { setPayData({ amount, term }); setPayOpen(true); }, []);

  const defaultTab = role === "admin" ? "admin-dashboard"
    : role === "administration" ? "adm-dashboard"
    : "dashboard";

  if (!authed) return <LoginScreen role={role} setRole={setRole} subRole={subRole} setSubRole={setSubRole}
    onSuccess={() => { setAuthed(true); setTab(defaultTab); }} />;

  const activeTab = tab || defaultTab;

  const pages = {
    dashboard: <ParentDashboard setTab={setTab} openPay={openPay} />,
    fees: <FeesPage openPay={openPay} />,
    attendance: <AttendancePage />,
    homework: <HomeworkPage />,
    online: <OnlineClasses />,
    reportcard: <ReportCard />,
    gallery: <PhotoGallery />,
    announcements: <AnnouncementsPage isAdmin={false} />,
    "admin-dashboard":    <ChairmanDashboard setTab={setTab} />,
    "admin-students":     <StudentOverview />,
    "admin-admissions":   <AdminAdmissions />,
    "admin-users":        <AdminUsers />,
    "admin-defaulters":   <AdminDefaulters />,
    "admin-requirements": <AdminRequirements />,
    "admin-announcements":<AnnouncementsPage isAdmin={true} />,
    "student-profiles":   <StudentDirectory />,
    "staff-gallery":      <StaffGallery />,
    "adm-dashboard":      <AdmDashboard subRole={subRole} setTab={setTab} />,
    "adm-fees":           <AdmFees />,
    "adm-defaulters":     <AdmDefaulters />,
    "adm-attendance":     <AdmAttendance />,
    "teacher-attendance": <TeacherAttendance />,
    "teacher-exams":      <TeacherExams />,
    "adm-staff":          <AdmStaff />,
    "adm-notices":        <AdmNotices />,
    "adm-exams":          <AdmExams />,
    "adm-admissions":     <AdmAdmissions />,
    "adm-requirements":   <AdminRequirements />,
  };

  return (
    <div style={{ minHeight: "100vh", background: MB, fontFamily: "'Segoe UI', sans-serif" }}>
      <TopBar role={role} subRole={subRole} />
      <div style={{ display: "flex", padding: 20, gap: 20 }}>
        <Sidebar tab={activeTab} setTab={setTab} role={role} subRole={subRole} />
        <div style={{ flex: 1, minWidth: 0 }}>{pages[activeTab] || <div style={{padding:40,textAlign:"center",color:"#ccc"}}>Page not found</div>}</div>
      </div>
      <PaySheet open={payOpen} onClose={() => setPayOpen(false)} amount={payData.amount} term={payData.term} />
      <div style={{ position: "fixed", bottom: 20, right: 20, background: MC, borderRadius: 12, padding: "10px 14px", boxShadow: "0 4px 20px rgba(0,0,0,.12)", border: `1px solid ${M}20` }}>
        <div style={{ fontSize: 10, color: "#aaa", marginBottom: 6, textAlign: "center" }}>Switch View</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", maxWidth: 220 }}>
          {[["parent","Parent"],["teacher","Teacher"],["admin","Chairman"],["administration","Admin"]].map(([r,l]) => (
            <button key={r} onClick={() => { setRole(r); setTab(r === "admin" ? "admin-dashboard" : r === "administration" ? "adm-dashboard" : r === "teacher" ? "dashboard" : "dashboard"); }}
              style={{ padding: "5px 10px", borderRadius: 8, border: "none", fontSize: 11, fontWeight: 600, cursor: "pointer", background: role === r ? M : "#eee", color: role === r ? "#fff" : "#555" }}>{l}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
