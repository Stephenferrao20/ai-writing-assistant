"use client";

import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, FileText, Search, Bell, User, Settings, Clock, Menu, X, LogOut, Edit } from 'lucide-react';
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useGetAllContent } from '@/hooks/useGetAllContent';
import { userLogout, deleteContent } from '@/lib/api_handler';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}
// Button Component
const Button = ({ children, onClick, type = 'button', className = '', size = 'md' }: ButtonProps) => {
  const baseClasses = "font-medium transition-all duration-300 rounded-3xl flex items-center justify-center gap-2";
  const sizes: { [key in 'sm' | 'md' | 'lg']: string } = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 md:px-6 md:py-3 text-base",
    lg: "px-6 py-3 md:px-8 md:py-4 text-lg"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${sizes[size!]} ${className}`}
    >
      {children}
    </button>
  );
};

interface DocumentCardProps {
  document: {
    id: number;
    title: string;
    body: string;
    created_at: string;
  };
  onEdit: () => void;
  onDelete: (id: number) => void;
}
// Document Card Component
const DocumentCard = ({ document, onEdit, onDelete }: DocumentCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-1 md:hover:-translate-y-2 hover:shadow-2xl group">
      <div className="flex items-start justify-between mb-4">
        {/* Make this area clickable for edit */}
        <div className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer" onClick={onEdit}>
          <div className="bg-purple-500/20 rounded-xl p-2 md:p-3 border border-purple-500/30 flex-shrink-0">
            <FileText className="text-purple-400" size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base md:text-lg font-bold text-white group-hover:text-purple-300 transition-colors truncate">
              {document.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="text-gray-400 flex-shrink-0" size={12} />
              <p className="text-xs md:text-sm text-gray-400 truncate">
                {formatDate(document.created_at)}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 md:gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={() => onEdit()}
            className="p-1.5 md:p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors border border-transparent hover:border-blue-500/30"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(document.id)}
            className="p-1.5 md:p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors border border-transparent hover:border-red-500/30"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      <p className="text-gray-300 text-sm line-clamp-3 mb-4 leading-relaxed">
        {document.body}
      </p>
    </div>
  );
};

// Header Component

  interface HeaderProps {
    user: { name: string };
    handleLogout: () => void;
  }
  
  const Header = ({ user, handleLogout }: HeaderProps) => {
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="relative z-10 px-4 py-4 md:py-6 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
      <div className="flex items-center space-x-2">
            <Edit className="w-8 h-8 text-purple-400" />
            <span className="text-xl font-bold">AI Writing Assistant</span>
          </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          
          
          <div className="flex items-center gap-2">
           
            
            <div className="flex items-center gap-2 ml-2">
              <div className="bg-purple-500/20 rounded-full p-2 border border-purple-500/30">
                <User className="text-purple-400" size={16} />
              </div>
              <span className="text-sm font-medium text-white">{user.name}</span>
            </div>
            <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors" title='Logout' onClick={handleLogout}>
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-b border-white/10 p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-purple-500/20 rounded-full p-2 border border-purple-500/30">
                <User className="text-purple-400" size={16} />
              </div>
              <span className="text-sm font-medium text-white">{user.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
                <Bell size={18} />
              </button>
              <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
                <Settings size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};



// Main Dashboard Component
const Dashboard = () => {
  const { data: user } = useCurrentUser();

// After
interface Document {
  id: number;
  title: string;
  body: string;
  created_at: string;
}

const [documents, setDocuments] = useState<Document[]>([]);

  const {data: content } = useGetAllContent();
  
  // setDocuments(content);
  useEffect(() => {
    if (content && Array.isArray(content.contents)) {
      setDocuments(content.contents);
    }
  }, [content]);

  

  const handleDeleteDocument = async (documentId: number) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    try {
      await deleteContent(documentId);
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      toast.success('Document deleted!');
    } catch (error) {
      if (error instanceof Error) {
        toast.error('Error deleting document: ' + error.message);
      } else {
        toast.error('Error deleting document: ' + String(error));
      }
    }
  };

  const router = useRouter();
  const queryClient = useQueryClient();
 
  const handleLogout = async () =>{
    try{
    await userLogout();
    queryClient.clear(); 
    toast.success("Logged out successfully!");
    router.replace("/auth"); 
  } 
  catch (e) {
    console.log(`error occured ${e}`);
    
    toast.error("Logout failed!");
  }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      <Header user={user} handleLogout={handleLogout} />
      
      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8 relative z-10">
        {/* Welcome Section */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-2xl md:text-4xl font-bold text-white">Welcome back, {user?.name?.split(' ')[0] ?? 'User'}!</h2>
            <span className="inline-block animate-bounce">👋</span>
          </div>
          <p className="text-gray-300 text-base md:text-lg">Manage your documents with AI-powered assistance</p>
        </div>

        {/* Create Document Button */}
        <div className="mb-6 md:mb-8">
          <Link href="/dashboard/editor">
            <Button size="md" className="w-full md:w-auto bg-purple-600">
              <Plus size={20} />
              Create New Document
            </Button>
          </Link>
        </div>

        
        {/* Recent Documents Section */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Recent Documents</h3>
              <p className="text-gray-300 text-sm md:text-base">Your latest work and collaboration</p>
            </div>
           
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {documents.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                onEdit={() => router.push(`/dashboard/editor/${document.id}`)}
                onDelete={handleDeleteDocument}
              />
            ))}
          </div>
        </div>
        
        {documents.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border border-white/20">
              <FileText className="text-purple-400" size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No documents yet</h3>
            <p className="text-gray-300 mb-6">Get started by creating your first document</p>
            <Link href="/dashboard/editor">
              <Button className='bg-purple-600'>
                <Plus size={20} />
                Create Your First Document
              </Button>
            </Link>
          </div>
        )}

      </main>
      
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
    </div>
  );
};

export default Dashboard;