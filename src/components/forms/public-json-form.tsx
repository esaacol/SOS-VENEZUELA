"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PublicJsonForm({ endpoint, children }: { endpoint: string; children: React.ReactNode }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("Enviando...");
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload: Record<string, FormDataEntryValue | boolean> = {};

    formData.forEach((value, key) => {
      payload[key] = value;
    });

    form.querySelectorAll<HTMLInputElement>("input[type=checkbox]").forEach((input) => {
      payload[input.name] = input.checked;
    });

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      setMessage(data.message ?? data.error ?? "Solicitud procesada.");
      if (response.ok) form.reset();
    } catch {
      setMessage("No se pudo enviar. Revisa tu conexion.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      {children}
      <Button type="submit" disabled={loading}>
        <Send className="h-4 w-4" /> Enviar
      </Button>
      {message ? <p className="rounded-lg border border-white/10 bg-white/[0.05] p-3 text-sm text-zinc-200">{message}</p> : null}
    </form>
  );
}
