"use client";

import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import {
  FileText, User, Bell, Settings, Menu, X,
  Sparkles
} from 'lucide-react';
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import TopicModal from '@/components/TopicModal'; 
import { useCreateContent, useUpdateContent } from '@/hooks/useContentMutation';;
import { marked } from 'marked';
import { toast } from 'sonner';

// Button Component
interface ButtonProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'toolbar';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
  disabled?: boolean;
}

const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '', size = 'md', active = false, disabled = false }: ButtonProps) => {
  const baseClasses = "font-medium transition-all duration-300 rounded-3xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const sizes: { [key: string]: string } = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };
  const variants: { [key: string]: string } = {
    primary: "bg-purple-600 hover:bg-purple-700 text-white",
    secondary: "bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20",
    danger: "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30",
    ghost: "text-gray-300 hover:text-white hover:bg-white/10",
    toolbar: active ? "bg-purple-500/30 text-purple-300 border border-purple-500/50" : "text-gray-300 hover:text-white hover:bg-white/10 border border-transparent"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// Header Component
type HeaderProps = {
  user: { name: string; email: string };
  documentTitle: string;
  onTitleChange: (title: string) => void;
  wordCount: number;
  charCount: number;
  onAssistantClick: () => void;
};

const Header = ({ user, documentTitle, onTitleChange, wordCount, charCount, onAssistantClick }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="relative z-10 px-4 py-4 md:py-6 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
          <div className="bg-purple-500/20 rounded-xl p-2 border border-purple-500/30 flex-shrink-0">
            <FileText className="text-purple-400" size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={documentTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              className="bg-transparent text-lg md:text-xl font-bold text-white placeholder-gray-400 border-none outline-none w-full"
              placeholder="Untitled Document"
            />
            <p className="text-xs md:text-sm text-gray-400 mt-1">
              {wordCount} words • {charCount} characters
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="secondary" size="sm" onClick={onAssistantClick}>
            <Sparkles size={16} />
            Assistant
          </Button>

          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
              <Bell size={18} />
            </button>
            <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
              <Settings size={18} />
            </button>
            <div className="flex items-center gap-2 ml-2">
              <div className="bg-purple-500/20 rounded-full p-2 border border-purple-500/30">
                <User className="text-purple-400" size={16} />
              </div>
              <span className="text-sm font-medium text-white">{user.name}</span>
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-b border-white/10 p-4 space-y-4">
          <Button variant="secondary" size="sm" className="w-full" onClick={onAssistantClick}>
            <Sparkles size={16} />
            Assistant
          </Button>

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

// Main Text Editor Component
const TextEditor = () => {
  const [documentTitle, setDocumentTitle] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [documentBody, setDocumentBody] = useState('');
  const [editor, setEditor] = useState<Editor | null>(null);
  const { data: user } = useCurrentUser();

  const [showTopicModal, setShowTopicModal] = useState(false);
  const { mutate: createNewContent } = useCreateContent();
  const { mutate: updateExistingContent } = useUpdateContent();
  const [contentId, setContentId] = useState<number | null>(null);


  const handleEditorContentChange = (content: string) => {
    setDocumentBody(content);
    console.log(documentBody);
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const text = tempDiv.textContent?.replace(/\u200B/g, '').trim() || '';
    const wordCount = text ? text.split(/\s+/).filter(Boolean).length : 0;
    const charCount = text.length;
    setWordCount(wordCount);
    setCharCount(charCount);
  };

  const handleTopicSubmit = (generatedText: string, generatedTitle: string) => {
    setShowTopicModal(false);
    if (editor) {
      const html = marked.parse(generatedText);
      editor.commands.setContent(html); 
    }
    setDocumentTitle(generatedTitle);
  };
  

  // Save handler using editor.getHTML()
  const handleSave = () => {
    const title = documentTitle;
    const body = editor ? editor.getHTML() : '';

    if (!title.trim() && !body.trim()) {
      toast.error('Title or content cannot be empty!');
      return;
    }

    if (typeof createNewContent === 'function' && typeof updateExistingContent === 'function') {
      if (contentId === null || typeof contentId === 'undefined') {
        // First-time creation
        createNewContent(
          { title, body },
          {
            onSuccess: (data) => {
              toast.success('Content created!');
              setContentId(data.content_id);
            },
            onError: (error) => {
              toast.error('Error creating content: ' + (error?.message || error));
            },
          }
        );
      } else {
        // Update existing content
        updateExistingContent(
          { id: contentId, title, body },
          {
            onSuccess: (data) => {
              console.log(data)
              toast.success('Content updated!');
            },
            onError: (error) => {
              toast.error('Error updating content: ' + (error?.message || error));
            },
          }
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Modal */}
      {showTopicModal && <TopicModal setShowTopicModal={setShowTopicModal} onSubmit={handleTopicSubmit} />}

      <Header
        user={user}
        documentTitle={documentTitle}
        onTitleChange={setDocumentTitle}
        wordCount={wordCount}
        charCount={charCount}
        onAssistantClick={() => setShowTopicModal(true)} 
      />

      <main className="max-w-5xl mx-auto px-4 py-6 md:py-8 relative z-10">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
          <SimpleEditor onContentChange={handleEditorContentChange} onEditorReady={setEditor} onSave={handleSave} />
        </div>

        {/* Save Button */}
        <div className="mt-4 flex justify-end rounded-3xl">
          <Button variant="primary" size="md" onClick={handleSave}>
            Save
          </Button>
        </div>

        
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

export default TextEditor;
