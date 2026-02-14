import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Trophy, Target, Crown, Medal, Users, 
  ChevronLeft, Wallet as WalletIcon, Clock, Gift 
} from "lucide-react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL, 
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const Leaderboard = ({ currentUserId }: { currentUserId: string }) => {
  const [leaders, setLeaders] = useState([]);
  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data } = await supabase.from('monthly_savings_leaderboard').select('*').limit(5);
      if (data) setLeaders(data);
    };
    fetchLeaderboard();
  }, []);

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="w-5 h-5 text-amber-500" />;
    if (index === 1) return <Medal className="w-5 h-5 text-slate-400" />;
    if (index === 2) return <Medal className="w-5 h-5 text-amber-700" />;
    return <span className="text-xs font-bold text-muted-foreground">{index + 1}</span>;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 px-2">
        <Users className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold">Top Savers</h3>
      </div>
      <div className="space-y-2">
        {leaders.map((user: any, index: number) => (
          <div key={user.user_id} className={`flex items-center justify-between p-3 rounded-2xl border ${user.user_id === currentUserId ? 'bg-primary/5 border-primary' : 'bg-card border-border'}`}>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 flex items-center justify-center">{getRankIcon(index)}</div>
              <p className="text-sm font-bold">{user.user_id === currentUserId ? "You" : `Rider #${user.user_id.slice(0, 4)}`}</p>
            </div>
            <p className="text-sm font-black text-primary">$${user.total_saved?.toFixed(2) || '0.00'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Wallet = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [monthlyRewards, setMonthlyRewards] = useState(0);
  const savingsGoal = 10.00;
  const currentUserId = "b8b01207-1904-468a-aa57-252d19528aff";

  useEffect(() => {
    const fetchWalletData = async () => {
      const { data } = await supabase.from('ledger').select('*').eq('user_id', currentUserId).order('created_at', { ascending: false });
      if (data) {
        setTransactions(data);
        setBalance(data.reduce((acc, curr) => acc + curr.amount, 0));
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const rewardTotal = data
          .filter(tx => tx.metadata?.type === 'delay_reward' && new Date(tx.created_at) >= firstDay)
          .reduce((acc, curr) => acc + curr.amount, 0);
        setMonthlyRewards(rewardTotal);
      }
    };
    fetchWalletData();
  }, []);

  const progress = Math.min((monthlyRewards / savingsGoal) * 100, 100);

  return (
    <div className="min-h-screen bg-background pb-10">
      <div className="p-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ChevronLeft className="w-6 h-6" /></Button>
        <h1 className="text-xl font-bold">Wallet</h1>
      </div>
      <div className="p-6 pt-0">
        <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <p className="text-xs font-medium opacity-70 uppercase tracking-widest mb-1">Total Balance</p>
          <h2 className="text-4xl font-bold mb-6">$${balance.toFixed(2)}</h2>
          <Button className="w-full bg-white text-slate-900 hover:bg-slate-200 rounded-2xl h-12 font-bold">Add Funds</Button>
          <WalletIcon className="absolute -bottom-4 -right-4 w-32 h-32 opacity-10 rotate-12" />
        </div>
      </div>
      <div className="p-6 space-y-6 pt-0">
        <div className="bg-card border border-border p-6 rounded-[2rem]">
          <div className="flex justify-between items-start mb-4">
            <div className="flex gap-3 items-center">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600"><Target className="w-5 h-5" /></div>
              <div>
                <h4 className="font-bold text-sm">Monthly Goal</h4>
                <p className="text-[10px] text-muted-foreground font-bold italic">Target: ${savingsGoal.toFixed(2)}</p>
              </div>
            </div>
            {progress === 100 && <Trophy className="w-6 h-6 text-amber-500 animate-bounce" />}
          </div>
          <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
             <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <Leaderboard currentUserId={currentUserId} />
      </div>
    </div>
  );
};

export default Wallet;
