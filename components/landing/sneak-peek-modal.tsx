"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SneakPeek } from "@/lib/landing-data";
import { ArrowLeft, ArrowRight, X } from "lucide-react";

type SneakPeekModalProps = {
  open: boolean;
  onClose: () => void;
  slides: SneakPeek[];
};

export function SneakPeekModal({ open, onClose, slides }: SneakPeekModalProps) {
  const [index, setIndex] = useState(0);
  const [fadeState, setFadeState] = useState<"idle" | "out" | "in">("idle");
  const [animating, setAnimating] = useState(false);
  const timeouts = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  useEffect(() => {
    return () => {
      timeouts.current.forEach((timeout) => clearTimeout(timeout));
      timeouts.current = [];
    };
  }, []);

  useEffect(() => {
    if (open) {
      setIndex(0);
      setFadeState("idle");
      setAnimating(false);
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const current = slides[index];

  const schedule = (fn: () => void, delay: number) => {
    const timeout = setTimeout(() => {
      fn();
      timeouts.current = timeouts.current.filter(
        (stored) => stored !== timeout
      );
    }, delay);
    timeouts.current.push(timeout);
  };

  const transitionTo = (nextIndex: number) => {
    if (animating || slides.length <= 1) {
      return;
    }
    setAnimating(true);
    setFadeState("out");
    schedule(() => {
      setIndex(nextIndex);
      setFadeState("in");
      schedule(() => {
        setFadeState("idle");
        setAnimating(false);
      }, 220);
    }, 200);
  };

  const goNext = () => {
    transitionTo((index + 1) % slides.length);
  };

  const goPrev = () => {
    transitionTo((index - 1 + slides.length) % slides.length);
  };

  const transitionClass =
    fadeState === "out"
      ? "opacity-0 translate-y-2"
      : "opacity-100 translate-y-0";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur">
      <div className="relative w-full max-w-sm rounded-[28px] border border-white/20 bg-white/95 p-6 shadow-[0_50px_120px_rgba(8,6,24,0.35)] sm:max-w-2xl lg:max-w-4xl lg:p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <Badge variant="outline" className="w-fit">
              Sneak peek
            </Badge>
            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-[0.35em] text-black/50">
                {current.status}
              </p>
              <h3 className="text-2xl font-semibold text-[#0B090C] sm:text-3xl">
                {current.title}
              </h3>
              <p className="text-sm text-black/60 sm:text-base">
                {current.summary}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div
          className={`mt-6 grid gap-5 transition-all duration-300 ease-out ${transitionClass} lg:grid-cols-[1.1fr_0.9fr]`}
        >
          <div className="rounded-[28px] border border-black/5 bg-linear-to-br from-white to-[#F5F0FF] p-5 shadow-[0_20px_60px_rgba(12,6,24,0.08)] sm:p-6">
            <p className="text-sm font-semibold text-[#0B090C]">Insight</p>
            <p className="mt-3 text-base leading-relaxed text-black/70 sm:text-lg">
              {current.insight}
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.25em] text-black/40 sm:text-xs">
              {current.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-black/10 px-3 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4 rounded-[28px] border border-black/5 bg-white/90 p-5 shadow-[0_20px_60px_rgba(12,6,24,0.08)] sm:p-6">
            <div className="rounded-3xl border border-black/5 bg-linear-to-br from-[#050505] via-[#111111] to-[#1f1f1f] p-5 text-white sm:p-6">
              <p className="text-lg font-semibold sm:text-2xl">
                {current.title}
              </p>
              <p className="mt-2 text-sm text-white/70">{current.summary}</p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goPrev}
                  disabled={animating}
                  className="h-11 w-11"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goNext}
                  disabled={animating}
                  className="h-11 w-11"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {slides.map((_, dotIndex) => (
                  <span
                    key={dotIndex}
                    className={`h-2 w-6 rounded-full transition-all ${
                      dotIndex === index ? "bg-black" : "bg-black/15"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
