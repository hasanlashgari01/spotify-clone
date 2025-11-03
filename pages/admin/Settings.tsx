import { useState } from 'react';

const Settings = () => {
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [compactTables, setCompactTables] = useState(false);
  const [confirmDestructive, setConfirmDestructive] = useState(true);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Settings</h2>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="font-medium">Auto refresh interval</div>
            <div className="text-sm text-white/60">Dashboard data refresh rate in seconds</div>
          </div>
          <input
            type="number"
            min={10}
            max={300}
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            className="w-24 rounded bg-white/5 border border-white/10 px-3 py-2 text-sm"
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="font-medium">Compact tables</div>
            <div className="text-sm text-white/60">Reduce paddings for denser tables</div>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={compactTables}
              onChange={(e) => setCompactTables(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:bg-emerald-500/40 relative">
              <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:left-6" />
            </div>
          </label>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="font-medium">Confirm destructive actions</div>
            <div className="text-sm text-white/60">Ask before delete/ban operations</div>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={confirmDestructive}
              onChange={(e) => setConfirmDestructive(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:bg-emerald-500/40 relative">
              <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:left-6" />
            </div>
          </label>
        </div>
      </div>

      <div className="text-xs text-white/50">Note: Settings are local to this device for now.</div>
    </div>
  );
};

export default Settings;


