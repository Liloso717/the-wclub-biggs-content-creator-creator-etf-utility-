import React, { useState } from 'react';
import { MOCK_TASKS } from '../constants';
import { Plus, Users } from 'lucide-react';
import { Tooltip } from './Tooltip';
import { BaseProps, Task } from '../types';

export const TaskBoard: React.FC<BaseProps> = ({ onInteract, walletConnected }) => {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [filter, setFilter] = useState<'all' | 'social' | 'bagworking' | 'community'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [dailyClaimed, setDailyClaimed] = useState(false);

  // Create Task Form State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskReward, setNewTaskReward] = useState('');
  const [newTaskUrl, setNewTaskUrl] = useState('');

  const filteredTasks = filter === 'all' 
    ? tasks.filter(t => t.type !== 'daily') // Show daily separately
    : tasks.filter(t => t.type === filter);

  // Filter for active community tasks for the showcase
  const activeCommunityTasks = tasks.filter(t => t.type === 'community' && !t.isCompleted);

  const handleClaim = () => {
    if (!walletConnected) {
      onInteract('error', 'Connect Wallet', 'Please connect wallet to claim rewards.');
      return;
    }
    onInteract('loading', 'Claiming Reward...', 'Verifying task completion.');
    setTimeout(() => {
      setDailyClaimed(true);
      onInteract('success', 'Reward Claimed!', '50 $thewclubbiggs added to your wallet.');
    }, 1500);
  }

  const handleCreateTask = () => {
     if (!walletConnected) {
       onInteract('error', 'Connect Wallet', 'You must connect your wallet to create a task.');
       return;
     }
     if (!newTaskTitle || !newTaskReward) {
       onInteract('error', 'Missing Information', 'Please provide a title and reward amount.');
       return;
     }

     const newTask: Task = {
       id: Date.now().toString(),
       title: newTaskTitle,
       reward: `${newTaskReward} $thewclubbiggs`,
       type: 'community',
       actionUrl: newTaskUrl || '#',
       isCompleted: false,
       creator: 'You'
     };

     setTasks(prev => [newTask, ...prev]);
     onInteract('success', 'Task Created', 'Your community task is now live!');
     setShowCreateModal(false);
     
     // Reset Form
     setNewTaskTitle('');
     setNewTaskReward('');
     setNewTaskUrl('');
  }

  return (
    <div className="space-y-6">
      {/* Active Community Tasks Showcase */}
      {activeCommunityTasks.length > 0 && (
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl uppercase animate-pulse">
            Live Now
          </div>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
              <Users size={20} />
            </div>
            <h2 className="text-xl font-bold text-white">Active Community Tasks</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeCommunityTasks.slice(0, 4).map(task => (
              <div key={task.id} className="bg-black/40 border border-white/10 rounded-lg p-3 hover:border-blue-400/50 transition cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-sm text-white group-hover:text-blue-300 transition">{task.title}</h4>
                  <span className="text-xs bg-neon-green/10 text-neon-green px-2 py-0.5 rounded border border-neon-green/20 font-bold whitespace-nowrap">
                    {task.reward}
                  </span>
                </div>
                {task.creator && (
                   <div className="flex items-center gap-2 mt-2">
                     <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-400 to-blue-400"></div>
                     <span className="text-xs text-gray-500">Posted by {task.creator}</span>
                   </div>
                )}
                <button 
                  className="w-full mt-3 bg-white/5 hover:bg-white/10 text-xs text-gray-300 py-2 rounded transition"
                  onClick={() => task.actionUrl && window.open(task.actionUrl, '_blank')}
                >
                  View Details &rarr;
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Claim Section */}
      <div className="bg-gradient-to-r from-neon-green/20 to-blue-500/20 border border-neon-green/50 rounded-xl p-6 relative overflow-visible group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition pointer-events-none">
          <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-white mb-1">Daily Login Bonus</h2>
              <Tooltip content="Check in every day to keep your streak alive. Higher streaks unlock multipliers on your rewards!" position="right">
                 <span className="text-xs bg-neon-green text-black px-2 py-0.5 rounded font-bold cursor-help">Streak Active</span>
              </Tooltip>
            </div>
            <p className="text-sm text-gray-300">Come back every day to earn free $thewclubbiggs and build your streak!</p>
            <div className="flex gap-1 mt-2">
               {[1, 2, 3, 4, 5, 6, 7].map(day => (
                 <Tooltip key={day} content={day <= 3 ? "Completed" : `Day ${day} Reward: ${50 + (day * 10)}`}>
                   <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold border cursor-default ${day <= 3 ? 'bg-neon-green text-black border-neon-green' : 'bg-black/50 text-gray-500 border-white/10'}`}>
                     {day <= 3 ? '✓' : day}
                   </div>
                 </Tooltip>
               ))}
            </div>
          </div>
          <button 
            onClick={handleClaim}
            disabled={dailyClaimed}
            className={`px-8 py-3 rounded-lg font-bold shadow-lg transition transform hover:scale-105 ${
              dailyClaimed 
              ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
              : 'bg-gradient-to-r from-neon-green to-blue-500 text-black animate-pulse-fast'
            }`}
          >
            {dailyClaimed ? 'Claimed via Contract' : 'Claim 50 $thewclubbiggs'}
          </button>
        </div>
      </div>

      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="text-2xl font-bold">Quest Board</h2>
          <p className="text-sm text-gray-400">Complete tasks or post your own</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-bold transition"
        >
          <Plus size={16} /> Create Task
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['all', 'social', 'bagworking', 'community'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 rounded-full text-xs font-bold capitalize whitespace-nowrap transition ${
              filter === f ? 'bg-white text-black' : 'bg-highlight text-gray-400 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredTasks.length === 0 && (
          <div className="text-center py-8 text-gray-500 bg-card-bg rounded-xl border border-white/5">
            No tasks found in this category.
          </div>
        )}
        {filteredTasks.map(task => (
          <div key={task.id} className={`flex items-center justify-between p-4 rounded-xl border transition hover:border-white/20 ${task.isCompleted ? 'bg-green-900/10 border-green-900/30' : 'bg-card-bg border-white/5'}`}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg flex-shrink-0 ${
                task.type === 'social' ? 'bg-blue-500/20 text-blue-400' : 
                task.type === 'community' ? 'bg-orange-500/20 text-orange-400' :
                'bg-purple-500/20 text-purple-400'
              }`}>
                {task.type === 'social' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                ) : task.type === 'community' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
                )}
              </div>
              <div>
                <h4 className={`font-medium ${task.isCompleted ? 'text-gray-500 line-through' : 'text-white'}`}>{task.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold text-neon-green">{task.reward}</span>
                  {task.creator && (
                    <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded">by {task.creator}</span>
                  )}
                </div>
              </div>
            </div>
            
            <button 
              disabled={task.isCompleted}
              className={`px-4 py-2 rounded text-sm font-bold transition ${
                task.isCompleted 
                  ? 'bg-transparent text-gray-500 cursor-not-allowed' 
                  : 'bg-white text-black hover:bg-gray-200'
              }`}
              onClick={() => task.actionUrl ? window.open(task.actionUrl, '_blank') : onInteract('info', 'Task Started', 'Follow instructions to complete.')}
            >
              {task.isCompleted ? 'Done' : 'Start'}
            </button>
          </div>
        ))}
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-card-bg border border-white/20 rounded-xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95">
            <h3 className="text-xl font-bold mb-4">Post Community Task</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Task Title</label>
                <input 
                  type="text" 
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded p-2 text-white focus:border-neon-green outline-none" 
                  placeholder="e.g. Retweet my art" 
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Reward Amount ($thewclubbiggs)</label>
                <input 
                  type="number" 
                  value={newTaskReward}
                  onChange={(e) => setNewTaskReward(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded p-2 text-white focus:border-neon-green outline-none" 
                  placeholder="50" 
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Link / Proof URL</label>
                <input 
                  type="text" 
                  value={newTaskUrl}
                  onChange={(e) => setNewTaskUrl(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded p-2 text-white focus:border-neon-green outline-none" 
                  placeholder="https://..." 
                />
              </div>
              <div className="pt-2 flex gap-2">
                <button 
                  onClick={() => setShowCreateModal(false)} 
                  className="flex-1 bg-gray-800 text-white py-2 rounded font-bold hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateTask} 
                  className="flex-1 bg-neon-green text-black py-2 rounded font-bold hover:bg-green-400 transition shadow-[0_0_15px_rgba(57,255,20,0.4)]"
                >
                  Post Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};