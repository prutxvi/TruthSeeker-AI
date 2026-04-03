/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setTimeout(() => router.push('/chat'), 500); // Wait auth cookie flush
      } else {
        const { error, data } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: { full_name: name || 'Anonymous Operator' }
          }
        });
        if (error) throw error;
        if (data?.user && data?.user?.identities?.length === 0) {
          throw new Error('User already exists');
        }
        setSuccess('ACCOUNT CREATED. PLEASE CONFIRM YOUR EMAIL, THEN LOGIN WITH YOUR PASSWORD.');
        setIsLogin(true);
        setPassword('');
        setName('');
      }
    } catch (err: any) {
      setError(err.message || 'AUTHENTICATION FAILED.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono relative overflow-hidden flex flex-col items-center">
      
      <div className="absolute top-0 inset-x-0 z-20 border-b border-white/20 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-mono text-white text-xl font-bold tracking-widest italic -skew-x-12 inline-block">TRUTH SEEKER</span>
          <div className="h-4 w-px bg-white/40"/>
          <span className="text-white/60 text-[10px] font-mono">EST. 2026</span>
        </div>
        <span className="hidden lg:block text-[10px] font-mono text-white/60">INTEL: CLASSIFIED · STATUS: SECURE</span>
      </div>

      <div className="w-full max-w-md border border-white/20 p-8 mt-48 relative group">
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/30" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white/30" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white/30" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/30" />

        <h1 className="tracking-widest text-white font-mono text-2xl font-bold mb-8 text-center">AUTHENTICATION REQUIRED</h1>

        <div className="flex mb-8 border-b border-white/20">
          <button 
            type="button"
            className={`flex-1 py-2 text-sm tracking-widest ${isLogin ? 'bg-white text-black' : 'text-white hover:bg-white/5'}`}
            onClick={() => setIsLogin(true)}
          >
            [ LOGIN ]
          </button>
          <button 
            type="button"
            className={`flex-1 py-2 text-sm tracking-widest ${!isLogin ? 'bg-white text-black' : 'text-white hover:bg-white/5'}`}
            onClick={() => setIsLogin(false)}
          >
            [ REGISTER ]
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ENTER OPERATIVE NAME..." 
                required={!isLogin}
                className="bg-black border border-white/40 text-white font-mono px-4 py-3 w-full focus:border-white outline-none rounded-none placeholder:text-white/40"
              />
            </div>
          )}
          <div>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ENTER EMAIL..." 
              required
              className="bg-black border border-white/40 text-white font-mono px-4 py-3 w-full focus:border-white outline-none rounded-none placeholder:text-white/40"
            />
          </div>
          <div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="ENTER PASSWORD..." 
              required
              className="bg-black border border-white/40 text-white font-mono px-4 py-3 w-full focus:border-white outline-none rounded-none placeholder:text-white/40"
            />
          </div>

          {error && (
            <div className="text-red-400 text-xs font-mono break-words">{error}</div>
          )}

          {success && (
            <div className="text-green-400 border border-green-400/30 bg-green-400/10 p-3 text-xs font-mono break-words flex items-start gap-2">
              <span>✓</span>
              <span>{success}</span>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="bg-white text-black font-mono w-full py-3 tracking-widest font-bold hover:bg-white/90 disabled:opacity-50"
          >
            {isLogin ? 'AUTHENTICATE →' : 'CREATE ACCOUNT →'}
          </button>
        </form>
      </div>
    </div>
  );
}
