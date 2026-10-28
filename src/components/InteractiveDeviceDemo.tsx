import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { soundManager } from '../utils/audio';
import {
  Smartphone,
  Laptop,
  CheckCircle2,
  RefreshCw,
  Send,
  ArrowDownLeft,
  Activity,
  Heart,
  Moon,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface InteractiveDeviceDemoProps {
  project: Project;
}

export const InteractiveDeviceDemo: React.FC<InteractiveDeviceDemoProps> = ({ project }) => {
  // FinTech State
  const [balance, setBalance] = useState(124850.40);
  const [activeTab, setActiveTab] = useState<'balance' | 'send' | 'activity'>('balance');
  const [sendAmount, setSendAmount] = useState('250.00');
  const [recipient, setRecipient] = useState('Sarah Jenkins');
  const [txHistory, setTxHistory] = useState([
    { id: 1, name: 'Apple Store', time: 'Just now', amount: '-$14.99', type: 'out' },
    { id: 2, name: 'Stripe Payout', time: '2h ago', amount: '+$3,450.00', type: 'in' },
    { id: 3, name: 'Cloud Server', time: 'Yesterday', amount: '-$64.20', type: 'out' },
  ]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Health / Telemetry State
  const [heartRate, setHeartRate] = useState(72);
  const [bleStatus, setBleStatus] = useState<'connected' | 'syncing' | 'idle'>('connected');
  const [ecgPoints, setEcgPoints] = useState<number[]>([]);

  // Telemetry loop for PulseHealth
  useEffect(() => {
    if (project.interactiveType === 'fitness') {
      const interval = setInterval(() => {
        setHeartRate((prev) => 70 + Math.floor(Math.random() * 8) - 4);
        setEcgPoints((prev) => {
          const nextVal = Math.sin(Date.now() / 200) * 20 + (Math.random() > 0.8 ? 35 : 0);
          const updated = [...prev, nextVal];
          return updated.slice(-30);
        });
      }, 300);
      return () => clearInterval(interval);
    }
  }, [project.interactiveType]);

  const handleSendTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(sendAmount);
    if (isNaN(val) || val <= 0) return;

    soundManager.playSwitch(true);
    setBalance((prev) => prev - val);
    setTxHistory((prev) => [
      {
        id: Date.now(),
        name: recipient || 'Transfer Recipient',
        time: 'Just now',
        amount: `-$${val.toFixed(2)}`,
        type: 'out',
      },
      ...prev,
    ]);
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      setActiveTab('activity');
    }, 1200);
  };

  const handleSimulateBleSync = () => {
    soundManager.playClick();
    setBleStatus('syncing');
    setTimeout(() => {
      setBleStatus('connected');
      soundManager.playSwitch(true);
    }, 1000);
  };

  if (project.interactiveType === 'fintech') {
    return (
      <div className="flex flex-col items-center justify-center p-3 sm:p-5 bg-graphite rounded-lg border border-hairline">
        <div className="flex items-center justify-between w-full max-w-sm mb-3">
          <div className="flex items-center gap-1.5 text-xs text-copper">
            <Smartphone className="w-4 h-4" />
            <span>Interactive Mobile Sandbox</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-copper/10 text-copper border border-copper/30">
            React Native + Swift
          </span>
        </div>

        {/* Smartphone Mockup Frame */}
        <div className="w-full max-w-sm bg-panel rounded-2xl p-3 border-2 border-hairline shadow-2xl relative overflow-hidden">
          {/* Top Notch & Status */}
          <div className="flex items-center justify-between px-3 pt-1 pb-2">
            <span className="text-[11px] font-bold text-paper/50">9:41</span>
            <div className="w-24 h-4 bg-black rounded-full" />
            <div className="flex items-center gap-1 text-[10px] text-paper/50">
              <Zap className="w-3 h-3 text-copper" />
              <span>5G</span>
            </div>
          </div>

          {/* Toast Notification */}
          {showSuccessToast && (
            <div className="absolute top-12 left-4 right-4 bg-solder/15 border border-solder/40 rounded-lg p-2.5 text-solder text-xs flex items-center gap-2 shadow-xl z-20">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Instant transfer confirmed via Secure Enclave</span>
            </div>
          )}

          {/* Subtabs */}
          <div className="grid grid-cols-3 gap-1 mb-3 bg-graphite p-1 rounded-lg">
            {(['balance', 'send', 'activity'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  soundManager.playClick();
                  setActiveTab(tab);
                }}
                className={`py-1 text-xs font-medium rounded-md capitalize transition-colors ${
                  activeTab === tab
                    ? 'bg-copper/20 text-copper border border-copper/40'
                    : 'text-paper/50 hover:text-paper'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* View 1: Balance & Sparkline */}
          {activeTab === 'balance' && (
            <div className="space-y-3">
              <div className="bg-graphite p-3.5 rounded-lg border border-hairline">
                <div className="text-[11px] text-paper/50">Encrypted vault</div>
                <div className="text-2xl font-bold font-mono text-paper mt-1">
                  ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[11px] text-solder font-semibold mt-1">
                  +18.4% (30-day net gain)
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setActiveTab('send');
                  }}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-md bg-copper hover:bg-copper-dim text-graphite text-xs font-semibold"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Cash</span>
                </button>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setBalance((b) => b + 500);
                    soundManager.playSwitch(true);
                  }}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-md bg-panel hover:bg-panel/70 border border-hairline text-copper text-xs font-semibold"
                >
                  <ArrowDownLeft className="w-3.5 h-3.5" />
                  <span>Deposit $500</span>
                </button>
              </div>
            </div>
          )}

          {/* View 2: Send Money */}
          {activeTab === 'send' && (
            <form onSubmit={handleSendTransfer} className="space-y-2.5">
              <div>
                <label className="text-[11px] text-paper/50">Recipient</label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 bg-graphite border border-hairline rounded-md text-xs text-paper focus:outline-none focus:border-copper"
                />
              </div>
              <div>
                <label className="text-[11px] text-paper/50">Amount ($ USD)</label>
                <input
                  type="number"
                  step="0.01"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 bg-graphite border border-hairline rounded-md text-xs font-mono text-paper focus:outline-none focus:border-copper"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-md bg-copper hover:bg-copper-dim text-graphite text-xs font-semibold transition-colors mt-2 cursor-pointer"
              >
                Authorize with FaceID / Biometric
              </button>
            </form>
          )}

          {/* View 3: Activity */}
          {activeTab === 'activity' && (
            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
              {txHistory.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-2 rounded-md bg-graphite border border-hairline text-xs"
                >
                  <div>
                    <div className="font-medium text-paper/80">{tx.name}</div>
                    <div className="text-[10px] text-paper/50 font-mono">{tx.time}</div>
                  </div>
                  <div
                    className={`font-mono font-semibold ${
                      tx.type === 'in' ? 'text-solder' : 'text-paper/70'
                    }`}
                  >
                    {tx.amount}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Device Home Indicator Bar */}
          <div className="w-24 h-1 bg-hairline rounded-full mx-auto mt-4" />
        </div>
      </div>
    );
  }

  if (project.interactiveType === 'fitness') {
    return (
      <div className="flex flex-col items-center justify-center p-3 sm:p-5 bg-graphite rounded-lg border border-hairline">
        <div className="flex items-center justify-between w-full max-w-sm mb-3">
          <div className="flex items-center gap-1.5 text-xs text-solder">
            <Activity className="w-4 h-4" />
            <span>Live Wearable Telemetry</span>
          </div>
          <button
            onClick={handleSimulateBleSync}
            className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-solder/15 text-solder border border-solder/40 hover:bg-solder/25 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${bleStatus === 'syncing' ? 'animate-spin' : ''}`} />
            <span>{bleStatus === 'syncing' ? 'Syncing BLE...' : 'BLE Connected'}</span>
          </button>
        </div>

        {/* Pulse OS Display */}
        <div className="w-full max-w-sm bg-panel rounded-2xl p-4 border-2 border-hairline shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-paper/50">Patient telemetry</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-solder/15 text-solder border border-solder/40">
              HIPAA secured
            </span>
          </div>

          <div className="bg-graphite p-3 rounded-md border border-hairline flex items-center justify-between">
            <div>
              <div className="text-[11px] text-paper/50 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                <span>Resting Heart Rate</span>
              </div>
              <div className="text-3xl font-bold font-mono text-paper mt-1">
                {heartRate} <span className="text-sm font-normal text-paper/50">BPM</span>
              </div>
            </div>
            <div className="w-20 h-10 flex items-center justify-center">
              <svg className="w-full h-full stroke-solder fill-none" viewBox="0 0 100 40">
                <polyline
                  points={
                    ecgPoints.length > 0
                      ? ecgPoints.map((val, idx) => `${idx * 3.4},${20 - val * 0.4}`).join(' ')
                      : '0,20 20,20 30,5 40,35 50,20 100,20'
                  }
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-graphite p-2.5 rounded-md border border-hairline">
              <div className="flex items-center gap-1 text-paper/50 text-[11px]">
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Sleep Score</span>
              </div>
              <div className="text-lg font-bold font-mono text-paper mt-0.5">88 / 100</div>
              <div className="text-[10px] text-solder mt-0.5">Optimal REM (2h 14m)</div>
            </div>

            <div className="bg-graphite p-2.5 rounded-md border border-hairline">
              <div className="flex items-center gap-1 text-paper/50 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-copper" />
                <span>Blood Oxygen</span>
              </div>
              <div className="text-lg font-bold font-mono text-paper mt-0.5">99% SpO2</div>
              <div className="text-[10px] text-copper mt-0.5">Normal physiological</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default Web preview
  return (
    <div className="flex flex-col items-center justify-center p-3 sm:p-5 bg-graphite rounded-lg border border-hairline">
      <div className="flex items-center justify-between w-full max-w-sm mb-3">
        <div className="flex items-center gap-1.5 text-xs text-copper">
          <Laptop className="w-4 h-4" />
          <span>Interactive Web Runtime</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-copper/10 text-copper border border-copper/30">
          Three.js + React 19
        </span>
      </div>

      <div className="w-full max-w-sm bg-panel rounded-lg p-4 border border-hairline space-y-3 text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-hairline">
          <span className="font-mono text-paper/70">Spatial Scene Inspector</span>
          <span className="text-[10px] font-mono text-solder">● 60 FPS Render</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-paper/50">
            <span>PBR Tone Mapping:</span>
            <span className="font-mono text-copper">ACES Filmic</span>
          </div>
          <div className="flex items-center justify-between text-paper/50">
            <span>Mesh Pipeline:</span>
            <span className="font-mono text-copper">glTF + Draco Wasm</span>
          </div>
          <div className="flex items-center justify-between text-paper/50">
            <span>Draw Calls:</span>
            <span className="font-mono text-solder">14 (Optimized)</span>
          </div>
        </div>

        <button
          onClick={() => {
            soundManager.playSwitch(true);
          }}
          className="w-full py-2 bg-copper hover:bg-copper-dim text-graphite rounded-md font-medium transition-colors cursor-pointer"
        >
          Re-benchmark WebAssembly Shader
        </button>
      </div>
    </div>
  );
};
