"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { siteConfig } from "@/lib/site-config";

export function ContactForm() {
  const t = useTranslations("contact");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Website enquiry: ${name || "Naxos Auto Rent"}`);
    const body = encodeURIComponent(`${message}\n\n${name}\n${email}`);
    window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`;
    toast.success(t("formNote"));
  }

  return (
    <form onSubmit={submit} className="space-y-3.5">
      <input
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t("formName")}
        className="w-full rounded-2xl border border-border bg-secondary/40 px-4 py-3.5 text-sm outline-none focus:border-primary focus:bg-white"
      />
      <input
        required
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t("formEmail")}
        className="w-full rounded-2xl border border-border bg-secondary/40 px-4 py-3.5 text-sm outline-none focus:border-primary focus:bg-white"
      />
      <textarea
        required
        rows={5}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={t("formMessage")}
        className="w-full resize-none rounded-2xl border border-border bg-secondary/40 px-4 py-3.5 text-sm outline-none focus:border-primary focus:bg-white"
      />
      <button type="submit" className="btn-primary w-full py-3.5">
        {t("formSubmit")}
      </button>
      <p className="text-center text-[11px] text-muted-foreground">{t("formNote")}</p>
    </form>
  );
}
