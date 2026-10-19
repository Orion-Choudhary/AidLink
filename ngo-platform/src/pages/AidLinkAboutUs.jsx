import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Link2,
  Eye,
  ShieldCheck,
  FileText,
  Users,
  MapPin,
  Lock,
  ArrowRight,
  Quote,
  Compass,
  HeartHandshake,
} from "lucide-react";
import usePageTitle from "../hooks/usePageTitle";

/* ---------- Tailwind-Native Scroll-Reveal Wrapper ---------- */
function Reveal({ children, as: Tag = "div", className = "", delay = 0 }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          io.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

export default function AboutUs() {
  usePageTitle("About Us & Accountability Model");
  const chainSteps = [
    {
      icon: Compass,
      title: "Intent",
      body: "What is the campaign trying to accomplish, and for whom?",
    },
    {
      icon: HeartHandshake,
      title: "Resources",
      body: "What support — funds, volunteers, supplies — has been mobilized?",
    },
    {
      icon: Users,
      title: "Action",
      body: "What relief activities are actually being carried out, on the ground?",
    },
    {
      icon: FileText,
      title: "Evidence",
      body: "What documentation has been submitted to support that account?",
    },
    {
      icon: Eye,
      title: "Outcome",
      body: "What impact has been reported back to the people who made it possible?",
    },
  ];

  const audiences = [
    {
      name: "Organizations",
      body: "Create campaigns, coordinate volunteers, log activities, and publish impact reports.",
    },
    {
      name: "Volunteers",
      body: "Discover relief opportunities, apply to campaigns, and build a real participation history.",
    },
    {
      name: "Donors",
      body: "Follow objectives, resource use, activities, and outcomes through one connected record.",
    },
    {
      name: "The Public",
      body: "Explore campaigns and their transparency record without needing to take part directly.",
    },
    {
      name: "Administrators",
      body: "Manage verification, monitor activity, review flags, and protect platform integrity.",
    },
  ];

  const principles = [
    {
      title: "Evidence over assertion",
      body: "Documentation is surfaced alongside claims, not offered as a substitute for it.",
    },
    {
      title: "Transparency without overclaiming",
      body: "We expose information. We don't pretend to establish truth on anyone's behalf.",
    },
    {
      title: "Privacy with dignity",
      body: "Beneficiary information stays aggregate and non-identifying, by design.",
    },
    {
      title: "Trust without a score",
      body: "Trust is multidimensional — built from observable history, not a single badge.",
    },
  ];

  const notList = [
    "A payment processor",
    "A banking or accounting system",
    "A government disaster-management system",
    "A background-check authority",
    "A guarantee of NGO or volunteer legitimacy",
    "A single-score reputation system",
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      
      {/* ---------------- hero ---------------- */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-green-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <span className="inline-block py-1 px-3 rounded-full bg-green-100 text-green-700 text-sm font-bold tracking-wider uppercase mb-6">
              About AidLink
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 max-w-4xl leading-tight">
              Making disaster relief more transparent, accountable, and connected.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl leading-relaxed">
              AidLink is an evidence-linked accountability and coordination
              platform. It brings what an organization intends to do,
              mobilizes, carries out, documents, and reports into one
              structured, connected record.
            </p>
            
            <div className="mt-10 flex flex-wrap items-center gap-3 text-sm font-bold text-green-700 uppercase tracking-wide">
              <span className="px-5 py-2 border-2 border-green-100 rounded-full bg-white shadow-sm">Intent</span>
              <span className="text-gray-300">→</span>
              <span className="px-5 py-2 border-2 border-green-100 rounded-full bg-white shadow-sm">Resources</span>
              <span className="text-gray-300">→</span>
              <span className="px-5 py-2 border-2 border-green-100 rounded-full bg-white shadow-sm">Action</span>
              <span className="text-gray-300">→</span>
              <span className="px-5 py-2 border-2 border-green-100 rounded-full bg-white shadow-sm">Evidence</span>
              <span className="text-gray-300">→</span>
              <span className="px-5 py-2 border-2 border-green-100 rounded-full bg-white shadow-sm">Outcome</span>
            </div>
            
            <div className="mt-12 pl-6 border-l-4 border-green-500 max-w-xl">
              <p className="text-lg md:text-xl font-medium text-gray-800 italic">
                "We don't ask people to trust blindly. We give them better
                information to make informed judgments."
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- why aidlink ---------------- */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <span className="text-green-600 font-bold uppercase tracking-wider text-sm">Why AidLink</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-gray-900 max-w-2xl">
              Relief happens on the ground. Accountability should be visible from anywhere.
            </h2>
          </Reveal>
          
          <Reveal delay={150}>
            <div className="mt-12 grid md:grid-cols-[1fr_auto_1fr] gap-8 items-center">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
                <h4 className="text-sm font-bold tracking-widest text-gray-500 uppercase mb-6">Today</h4>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-gray-600"><span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> Scattered reports</li>
                  <li className="flex items-center gap-3 text-gray-600"><span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> Social media updates</li>
                  <li className="flex items-center gap-3 text-gray-600"><span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> Private messages</li>
                  <li className="flex items-center gap-3 text-gray-600"><span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> Separate donation platforms</li>
                  <li className="flex items-center gap-3 text-gray-600"><span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> Loose photographs</li>
                </ul>
              </div>
              
              <div className="hidden md:flex w-12 h-12 bg-green-100 text-green-600 rounded-full items-center justify-center">
                <ArrowRight size={20} />
              </div>
              <div className="flex md:hidden justify-center text-green-600">
                <ArrowRight size={24} className="rotate-90" />
              </div>
              
              <div className="bg-green-900 border border-green-800 rounded-2xl p-8 shadow-xl">
                <h4 className="text-sm font-bold tracking-widest text-green-400 uppercase mb-6">With AidLink</h4>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-gray-100"><span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> One connected campaign</li>
                  <li className="flex items-center gap-3 text-gray-100"><span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> One structured record</li>
                  <li className="flex items-center gap-3 text-gray-100"><span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> Connected evidence</li>
                  <li className="flex items-center gap-3 text-gray-100"><span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> Transparent reporting</li>
                  <li className="flex items-center gap-3 text-gray-100"><span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> A record anyone can follow</li>
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- who it's for ---------------- */}
      <section className="py-16 md:py-24 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <span className="text-green-600 font-bold uppercase tracking-wider text-sm">Who it's for</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-gray-900">
              Built for everyone a relief effort touches.
            </h2>
          </Reveal>
          
          <Reveal delay={150}>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {audiences.map((a) => (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-green-300 transition-all cursor-default" key={a.name}>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{a.name}</h4>
                  <p className="text-gray-600 leading-relaxed">{a.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- accountability model ---------------- */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <span className="text-green-600 font-bold uppercase tracking-wider text-sm">Our accountability model</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-gray-900">
              One thread, running through every campaign.
            </h2>
          </Reveal>
          
          <div className="mt-16 space-y-10 relative">
            {/* The line connecting nodes */}
            <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-green-100 hidden sm:block"></div>
            
            {chainSteps.map((s, i) => (
              <Reveal as="div" delay={i * 100} key={s.title} className="relative z-10 flex flex-col sm:flex-row gap-6 sm:gap-8">
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg shrink-0 shadow-lg">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="pt-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-green-600">Step {i + 1}</span>
                  <h4 className="text-2xl font-bold text-gray-900 mt-1">{s.title}</h4>
                  <p className="mt-2 text-lg text-gray-600 max-w-2xl">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- evidence not certainty ---------------- */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="bg-green-50 rounded-3xl p-8 md:p-12 relative overflow-hidden">
              <Quote size={80} className="absolute -top-4 -left-4 text-green-200/50 rotate-180" />
              <span className="text-green-700 font-bold uppercase tracking-wider text-sm relative z-10">Evidence, not claims of certainty</span>
              <p className="mt-6 text-2xl md:text-3xl font-extrabold text-gray-900 max-w-3xl leading-snug relative z-10">
                Transparency should enable judgment — not replace it.
              </p>
              
              <div className="mt-10 grid sm:grid-cols-2 gap-6 relative z-10">
                <div className="border-l-2 border-green-300 pl-4 text-gray-700 font-medium">A photograph doesn't automatically prove an activity happened.</div>
                <div className="border-l-2 border-green-300 pl-4 text-gray-700 font-medium">A verification badge doesn't guarantee future conduct.</div>
                <div className="border-l-2 border-green-300 pl-4 text-gray-700 font-medium">A declared expense isn't the same as an audited statement.</div>
                <div className="border-l-2 border-green-300 pl-4 text-gray-700 font-medium">We organize evidence so people can evaluate it — not to declare truth for them.</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- privacy ---------------- */}
      <section className="py-16 md:py-24 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
            <Reveal>
              <span className="text-green-600 font-bold uppercase tracking-wider text-sm">Designed with privacy in mind</span>
              <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-gray-900">
                Accountability should never cost anyone their dignity.
              </h2>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                Relief work involves vulnerable communities. AidLink treats
                beneficiary information differently from ordinary operational
                data, and never builds individual beneficiary profiles.
              </p>
            </Reveal>
            
            <Reveal delay={150}>
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 p-4 rounded-xl flex items-center gap-4 shadow-sm">
                  <div className="bg-green-100 text-green-700 p-3 rounded-lg"><Users size={20} /></div>
                  <span className="font-medium text-gray-800">Number of people reached, kept in aggregate</span>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-xl flex items-center gap-4 shadow-sm">
                  <div className="bg-green-100 text-green-700 p-3 rounded-lg"><ShieldCheck size={20} /></div>
                  <span className="font-medium text-gray-800">Type of assistance provided, not individual records</span>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-xl flex items-center gap-4 shadow-sm">
                  <div className="bg-green-100 text-green-700 p-3 rounded-lg"><MapPin size={20} /></div>
                  <span className="font-medium text-gray-800">Broad location, not precise beneficiary addresses</span>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-xl flex items-center gap-4 shadow-sm">
                  <div className="bg-green-100 text-green-700 p-3 rounded-lg"><Lock size={20} /></div>
                  <span className="font-medium text-gray-800">Photographs and identifying evidence handled with care</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- principles ---------------- */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <span className="text-green-600 font-bold uppercase tracking-wider text-sm">Our principles</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-gray-900">What guides how we build.</h2>
          </Reveal>
          
          <Reveal delay={150}>
            <div className="mt-12 bg-gray-200 p-px rounded-2xl grid sm:grid-cols-2 gap-px overflow-hidden">
              {principles.map((p, i) => (
                <div className="bg-white p-8" key={p.title}>
                  <div className="text-sm font-bold text-green-600 tracking-widest">{String(i + 1).padStart(2, "0")}</div>
                  <h4 className="mt-4 text-xl font-bold text-gray-900">{p.title}</h4>
                  <p className="mt-2 text-gray-600 leading-relaxed">{p.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- what we're not ---------------- */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="bg-gray-900 text-white rounded-3xl p-10 md:p-16 shadow-2xl">
              <span className="text-green-400 font-bold uppercase tracking-wider text-sm">What AidLink is not</span>
              <h3 className="mt-4 text-2xl md:text-3xl font-extrabold max-w-2xl leading-snug">
                We believe responsible technology should be clear about its limits.
              </h3>
              
              <div className="mt-12 grid sm:grid-cols-2 gap-x-8 gap-y-4">
                {notList.map((item) => (
                  <div key={item} className="flex items-center gap-3 py-3 border-b border-gray-700/50 text-gray-300 font-medium">
                    <span className="text-green-400 font-bold">—</span> {item}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- closing ---------------- */}
      <section className="py-24 bg-gray-50 border-t border-gray-200 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-10">
              "Don't ask people to trust more. Help them see more."
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register/individual" 
                className="px-8 py-4 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition-colors shadow-md flex items-center justify-center gap-2"
              >
                Explore campaigns <ArrowRight size={18} />
              </Link>
              <Link 
                to="/#campaigns" 
                className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 font-bold rounded-full hover:bg-gray-50 hover:border-gray-400 transition-colors flex items-center justify-center"
              >
                Learn how AidLink works
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}