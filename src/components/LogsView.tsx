import React, { useState } from 'react';
import { Search, Filter, CheckCircle2, XCircle, Clock, ExternalLink, MessageCircle, Send, ArrowUpDown } from 'lucide-react';
import { CommentEvent, Language } from '../types';
import { getT } from '../utils/translations';

interface LogsViewProps {
  events: CommentEvent[];
  lang: Language;
}

export const LogsView: React.FC<LogsViewProps> = ({ events, lang }) => {
  const t = getT(lang);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'delivered' | 'ignored'>('all');
  const [selectedEvent, setSelectedEvent] = useState<CommentEvent | null>(null);

  const filteredEvents = events.filter((ev) => {
    if (statusFilter !== 'all' && ev.dmStatus !== statusFilter) return false;
    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase();
    return (
      ev.username.toLowerCase().includes(term) ||
      ev.commentText.toLowerCase().includes(term) ||
      (ev.matchedKeyword && ev.matchedKeyword.toLowerCase().includes(term)) ||
      ev.reelTitle.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>{t.logsTitle}</span>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {events.length} {lang === 'kn' ? 'ಈವೆಂಟ್‌ಗಳು' : 'records'}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t.logsSubtitle}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#121622] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-rose-500"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#121622] border border-white/10 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-white/15 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.filterAll}
          </button>
          <button
            onClick={() => setStatusFilter('delivered')}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              statusFilter === 'delivered'
                ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.filterDelivered}
          </button>
          <button
            onClick={() => setStatusFilter('ignored')}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              statusFilter === 'ignored'
                ? 'bg-slate-500/20 text-slate-300 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.filterIgnored}
          </button>
        </div>
      </div>

      {/* High Density Table */}
      <div className="rounded-xl border border-white/10 bg-[#121622] overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-slate-400 font-semibold">
                <th className="py-3 px-4">{t.colTime}</th>
                <th className="py-3 px-4">{t.colUser}</th>
                <th className="py-3 px-4">{t.colReel}</th>
                <th className="py-3 px-4">{t.colComment}</th>
                <th className="py-3 px-4">{t.colMatchedKeyword}</th>
                <th className="py-3 px-4">{t.colStatus}</th>
                <th className="py-3 px-4 text-right">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    {lang === 'kn' ? 'ಯಾವುದೇ ಈವೆಂಟ್‌ಗಳು ಸಿಗಲಿಲ್ಲ' : 'No activity logged matching your filter.'}
                  </td>
                </tr>
              ) : (
                filteredEvents.map((ev) => {
                  return (
                    <tr
                      key={ev.id}
                      onClick={() => setSelectedEvent(ev)}
                      className="hover:bg-white/5 cursor-pointer transition-colors"
                    >
                      {/* Timestamp */}
                      <td className="py-3 px-4 font-mono tabular-nums text-slate-400 whitespace-nowrap">
                        {ev.timestamp}
                      </td>

                      {/* User */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <img
                            src={ev.userAvatar}
                            alt={ev.username}
                            className="w-5 h-5 rounded-full bg-slate-800"
                          />
                          <span className="font-medium text-white">@{ev.username}</span>
                        </div>
                      </td>

                      {/* Reel */}
                      <td className="py-3 px-4 max-w-[180px] truncate text-slate-400" title={ev.reelTitle}>
                        {ev.reelTitle}
                      </td>

                      {/* Comment */}
                      <td className="py-3 px-4 max-w-[220px] truncate text-white" title={ev.commentText}>
                        "{ev.commentText}"
                      </td>

                      {/* Matched Keyword */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {ev.matchedKeyword ? (
                          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold">
                            {ev.matchedKeyword}
                          </span>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {ev.dmStatus === 'delivered' ? (
                          <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>DM Sent</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-slate-500">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>No Match</span>
                          </span>
                        )}
                      </td>

                      {/* Latency */}
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-400 whitespace-nowrap">
                        {ev.latencyMs}ms
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Event Details Drawer/Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121622] border border-white/10 rounded-2xl p-5 sm:p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Event Inspection</span>
                <span className="font-mono text-xs text-slate-400">#{selectedEvent.id}</span>
              </h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-white/5"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 bg-black/40 rounded-xl border border-white/5">
                <div>
                  <span className="text-slate-500 block">User:</span>
                  <span className="text-white font-medium">@{selectedEvent.username}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Delivery Speed:</span>
                  <span className="text-rose-400 font-mono tabular-nums">{selectedEvent.latencyMs}ms</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block mb-1">User Comment:</span>
                <p className="p-3 bg-black/40 rounded-xl text-white font-mono text-xs">
                  "{selectedEvent.commentText}"
                </p>
              </div>

              {selectedEvent.dmContent && (
                <div>
                  <span className="text-slate-400 font-semibold block mb-1">Dispatched Instagram DM:</span>
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-slate-200 whitespace-pre-wrap">
                    {selectedEvent.dmContent}
                  </div>
                </div>
              )}

              {selectedEvent.linkUrl && (
                <div>
                  <span className="text-slate-400 font-semibold block mb-1">Attached Target Link:</span>
                  <a
                    href={selectedEvent.linkUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 bg-black/40 rounded-xl text-rose-400 font-mono text-xs flex items-center justify-between hover:underline"
                  >
                    <span className="truncate">{selectedEvent.linkUrl}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0 ml-2" />
                  </a>
                </div>
              )}

              {selectedEvent.publicReplyText && (
                <div>
                  <span className="text-slate-400 font-semibold block mb-1">Public Reply on Reel:</span>
                  <p className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300">
                    "{selectedEvent.publicReplyText}"
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedEvent(null)}
              className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white font-semibold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
