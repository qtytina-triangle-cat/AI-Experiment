import React, { useState } from 'react';
import Head from 'next/head';
import designSystem from '../Design_guidelines.json';
import { 
  Search, Video, Bell, CheckCircle2, Printer, MoreVertical, 
  Plus, Clock, Pencil, Trash2, ChevronDown, User, 
  FileText, ExternalLink, Send, Circle, Sparkles, 
  ListTodo, Link2, Monitor, AlertTriangle, X 
} from 'lucide-react';

const IconMap: Record<string, React.ComponentType<any>> = {
  Search, Video, Bell, CheckCircle2, Printer, MoreVertical, 
  Plus, Clock, Pencil, Trash2, ChevronDown, User, 
  FileText, ExternalLink, Send, Circle, Sparkles, 
  ListTodo, Link2, Monitor
};

// NavItem Component for Style Guide
interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  status?: string;
  active?: boolean;
  hasSubItems?: boolean;
  subItems?: { label: string; active?: boolean }[];
}

function NavItem({
  icon,
  label,
  status,
  active,
  hasSubItems,
  subItems,
}: NavItemProps) {
  return (
    <div>
      <div
        className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors ${
          active
            ? "bg-primary-50 border-l-2 border-primary-600"
            : "hover:bg-slate-50 border-l-2 border-transparent"
        }`}
      >
        <div className={active ? "text-primary-600" : "text-slate-400"}>
          {icon}
        </div>
        <div className="flex-1">
          <div
            className={`text-sm font-medium ${
              active ? "text-primary-600" : "text-slate-700"
            }`}
          >
            {label}
          </div>
          {status && (
            <div className="text-xs text-slate-500 mt-0.5">{status}</div>
          )}
        </div>
      </div>
      {hasSubItems && subItems && (
        <div className="ml-11 pb-2">
          {subItems.map((item, index) => (
            <div
              key={index}
              className={`text-sm py-1.5 cursor-pointer ${
                item.active
                  ? "text-primary-600 font-medium"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              • {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import MeetingHeader from '../components/MeetingHeader';
import SecondaryHeader from '../components/SecondaryHeader';
import Table from '../components/Table';
import Avatar from '../components/Avatar';
import Modal from '../components/Modal';

// Modal Demo Component for Style Guide
interface ModalDemoProps {
  title: string;
  variant: 'warning' | 'danger' | 'info';
  modalTitle: string;
  modalMessage: string;
  confirmText: string;
}

function ModalDemo({
  title,
  variant,
  modalTitle,
  modalMessage,
  confirmText,
}: ModalDemoProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</h4>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
      >
        Show Modal
      </button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={() => {
          setIsOpen(false);
          alert('Confirmed!');
        }}
        title={modalTitle}
        message={modalMessage}
        confirmText={confirmText}
        variant={variant}
      />
    </div>
  );
}

export default function StyleGuide() {
  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900">
      <Head>
        <title>Style Guide - {designSystem.metadata.name}</title>
      </Head>

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <header className="border-b border-slate-200 pb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{designSystem.metadata.name}</h1>
          <p className="text-slate-500">Version {designSystem.metadata.version} • Last Updated {designSystem.metadata.lastUpdated}</p>
          <p className="mt-4 text-slate-600 max-w-2xl">{designSystem.metadata.description}</p>
        </header>

        {/* Colors */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-800 border-b border-slate-200 pb-2">Colors</h2>
          
          <div className="space-y-8">
            {/* Primary Colors */}
            <div>
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">Primary</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(designSystem.colors.primary).map(([shade, value]) => (
                  <div key={shade} className="space-y-2">
                    <div className="h-24 rounded-lg shadow-sm" style={{ backgroundColor: value }}></div>
                    <div className="px-1">
                      <p className="font-medium text-slate-900">primary-{shade}</p>
                      <p className="text-xs text-slate-500 uppercase">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Neutral Colors */}
            <div>
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">Neutral</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(designSystem.colors.neutral).map(([shade, value]) => {
                  const usageMap: Record<string, string> = {
                    '50': 'Page backgrounds, hover states',
                    '100': 'Subtle hover states, scrollbar track',
                    '200': 'Borders, dividers',
                    '300': 'Separator lines, footer dividers',
                    '400': 'Icons, placeholders',
                    '500': 'Secondary text, metadata',
                    '600': 'Body text, sub-items',
                    '700': 'Labels, primary text',
                    '800': 'Headings, emphasis text'
                  };
                  
                  return (
                    <div key={shade} className="space-y-2">
                      <div className="h-24 rounded-lg shadow-sm border border-slate-100" style={{ backgroundColor: value }}></div>
                      <div className="px-1">
                        <p className="font-medium text-slate-900">slate-{shade}</p>
                        <p className="text-xs text-slate-500 uppercase mb-1">{value}</p>
                        <p className="text-xs text-slate-600 leading-tight">{usageMap[shade]}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Semantic Colors */}
            <div>
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">Semantic</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {Object.entries(designSystem.colors.semantic).map(([name, values]: [string, any]) => (
                  <div key={name} className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-12 h-12 rounded-lg shadow-sm" style={{ backgroundColor: values.base }}></div>
                      <div>
                        <p className="font-medium capitalize text-slate-900">{name}</p>
                        <p className="text-xs text-slate-500">{values.base}</p>
                      </div>
                    </div>
                    {values.bg && (
                      <div className="flex items-center space-x-2">
                        <div className="w-12 h-12 rounded-lg shadow-sm border border-slate-100" style={{ backgroundColor: values.bg }}></div>
                        <div>
                          <p className="font-medium text-sm text-slate-700">{name} Bg</p>
                          <p className="text-xs text-slate-500">{values.bg}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-800 border-b border-slate-200 pb-2">Typography</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-6">Font Family</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-4xl text-slate-900">Aa Bb Cc 123</p>
                  <p className="mt-2 text-sm text-slate-500">Primary: {designSystem.typography.fontFamily.primary}</p>
                </div>
              </div>

              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mt-8 mb-6">Weights</h3>
              <div className="space-y-4">
                {Object.entries(designSystem.typography.weights).map(([name, value]) => (
                  <div key={name} className="flex items-baseline justify-between border-b border-slate-100 pb-2">
                    <span style={{ fontWeight: value }} className="text-2xl">The quick brown fox</span>
                    <span className="text-sm text-slate-500 font-mono">{name} ({value})</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-6">Scale</h3>
              <div className="space-y-6">
                {Object.entries(designSystem.typography.sizes).map(([name, values]: [string, any]) => (
                  <div key={name} className="flex items-baseline gap-8">
                    <div className="w-24 shrink-0 text-sm text-slate-400 font-mono">
                      text-{name}<br/>
                      {values.size} / {values.lineHeight}
                    </div>
                    <div style={{ fontSize: values.size, lineHeight: values.lineHeight }}>
                      The quick brown fox jumps over the lazy dog.
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Components */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-800 border-b border-slate-200 pb-2">Components</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Buttons */}
            <div className="space-y-6">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Buttons</h3>
              <div className="flex flex-wrap gap-4 items-center p-6 bg-white rounded-xl border border-slate-200">
                <button className={`${designSystem.components.buttons.primary.bg} ${designSystem.components.buttons.primary.text} ${designSystem.components.buttons.primary.hover} ${designSystem.components.buttons.primary.radius} ${designSystem.components.buttons.primary.padding} ${designSystem.components.buttons.primary.font}`}>
                  Primary Button
                </button>
                <div className="flex items-center gap-4">
                  <button className={`${designSystem.components.buttons.secondary.bg} ${designSystem.components.buttons.secondary.border} ${designSystem.components.buttons.secondary.text} ${designSystem.components.buttons.secondary.hover} ${designSystem.components.buttons.secondary.radius} ${designSystem.components.buttons.secondary.padding} ${designSystem.components.buttons.secondary.font}`}>
                    Secondary Button
                  </button>
                  <button className={`${designSystem.components.buttons.secondary.bg} ${designSystem.components.buttons.secondary.border} ${designSystem.components.buttons.secondary.text} ${designSystem.components.buttons.secondary.hover} ${designSystem.components.buttons.secondary.radius} px-3 py-1 text-xs font-medium`}>
                    Small Secondary
                  </button>
                </div>
                <button className={`${designSystem.components.buttons.icon.padding} ${designSystem.components.buttons.icon.radius} ${designSystem.components.buttons.icon.hover} ${designSystem.components.buttons.icon.transition} text-slate-500`}>
                  <Bell className="w-5 h-5" />
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors">
                  <Plus className="w-4 h-4" />
                  Ghost Button
                </button>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-6">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Inputs</h3>
              <div className="space-y-4 p-6 bg-white rounded-xl border border-slate-200">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Default Input</label>
                  <input 
                    type="text" 
                    placeholder="Enter text..." 
                    className={`w-full ${designSystem.components.inputs.base.bg} ${designSystem.components.inputs.base.border} ${designSystem.components.inputs.base.radius} ${designSystem.components.inputs.base.text} ${designSystem.components.inputs.base.placeholder} ${designSystem.components.inputs.base.focus} p-2`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Error State</label>
                  <input 
                    type="text" 
                    defaultValue="Invalid input"
                    className={`w-full ${designSystem.components.inputs.base.bg} ${designSystem.components.inputs.error.border} ${designSystem.components.inputs.base.radius} ${designSystem.components.inputs.base.text} ${designSystem.components.inputs.error.focus} focus:outline-none focus:ring-2 p-2`}
                  />
                  <p className="mt-1 text-xs text-red-500">This field is required.</p>
                </div>
              </div>
            </div>

            {/* Cards */}
            <div className="space-y-6">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Cards</h3>
              <div className={`${designSystem.components.cards.base.bg} ${designSystem.components.cards.base.border} ${designSystem.components.cards.base.radius} ${designSystem.components.cards.base.padding} ${designSystem.components.cards.base.shadow}`}>
                <h4 className="text-lg font-semibold text-slate-800 mb-2">Card Title</h4>
                <p className="text-slate-600 mb-4">This is a standard card component used throughout the application for grouping related content.</p>
                <div className="flex gap-2">
                  <span className={`${designSystem.components.badges.base.padding} ${designSystem.components.badges.base.radius} ${designSystem.components.badges.base.font} ${designSystem.components.badges.success.bg} ${designSystem.components.badges.success.text}`}>
                    Active
                  </span>
                  <span className={`${designSystem.components.badges.base.padding} ${designSystem.components.badges.base.radius} ${designSystem.components.badges.base.font} ${designSystem.components.badges.warning.bg} ${designSystem.components.badges.warning.text}`}>
                    Pending
                  </span>
                </div>
              </div>
            </div>

            {/* Avatars */}
            <div className="space-y-6">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Avatars</h3>
              <div className="grid grid-cols-1 gap-8">
                {/* Single State */}
                <div className="space-y-4">
                  <h4 className="text-xs text-slate-500 font-medium">Single State</h4>
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center gap-2">
                      <Avatar initials="T" size="md" variant="teal" />
                      <span className="text-xs text-slate-400">Teal (Default)</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Avatar initials="A" size="md" variant="blue" />
                      <span className="text-xs text-slate-400">Blue</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Avatar initials="M" size="md" variant="purple" />
                      <span className="text-xs text-slate-400">Purple</span>
                    </div>
                  </div>
                </div>
                
                {/* Stacking State */}
                <div className="space-y-4">
                  <h4 className="text-xs text-slate-500 font-medium">Stacking State</h4>
                  <div className="flex items-center -space-x-3">
                    <Avatar initials="A" size="md" variant="blue" className="z-20" />
                    <Avatar initials="M" size="md" variant="purple" className="z-10" />
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    Overlapping avatars with white ring border to create separation.
                  </p>
                </div>

                {/* Sizes */}
                <div className="space-y-4">
                  <h4 className="text-xs text-slate-500 font-medium">Sizes</h4>
                  <div className="flex items-end gap-4">
                    <Avatar initials="S" size="sm" />
                    <Avatar initials="M" size="md" />
                    <Avatar initials="L" size="lg" />
                  </div>
                </div>
              </div>
            </div>

            {/* Shadows & Radius */}
            <div className="space-y-6">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Shadows & Radius</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 flex items-center justify-center h-24 text-sm text-slate-500">shadow-sm</div>
                <div className="bg-white p-4 rounded-lg shadow border border-slate-100 flex items-center justify-center h-24 text-sm text-slate-500">shadow</div>
                <div className="bg-white p-4 rounded-lg shadow-md border border-slate-100 flex items-center justify-center h-24 text-sm text-slate-500">shadow-md</div>
                <div className="bg-white p-4 rounded-lg shadow-lg border border-slate-100 flex items-center justify-center h-24 text-sm text-slate-500">shadow-lg</div>
              </div>
            </div>
          </div>
        </section>

        {/* Molecular Components */}
        <section className="space-y-12">
          <h2 className="text-2xl font-semibold text-slate-800 border-b border-slate-200 pb-2">Molecular Components</h2>

          {/* Side Navigation */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-slate-700">Side Navigation</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* States */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Item States</h4>
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden w-64">
                  <NavItem
                    icon={<CheckCircle2 className="h-5 w-5" />}
                    label="Default Item"
                    status="Optional status text"
                  />
                  <NavItem
                    icon={<CheckCircle2 className="h-5 w-5" />}
                    label="Active Item"
                    active={true}
                    status="Active status"
                  />
                  <NavItem
                    icon={<Circle className="h-5 w-5" />}
                    label="Pending Item"
                    status="Not started"
                  />
                  <NavItem
                    icon={
                      <div className="h-5 w-5 border-[1.5px] border-dashed border-slate-400 rounded-full flex items-center justify-center">
                        <Plus className="h-3 w-3 text-slate-400" />
                      </div>
                    }
                    label="Optional Item"
                    status="Secondary"
                  />
                  <NavItem
                    icon={<CheckCircle2 className="h-5 w-5" />}
                    label="With Sub-items"
                    active={true}
                    hasSubItems={true}
                    subItems={[
                      { label: "Sub-item 1" },
                      { label: "Active Sub-item", active: true },
                      { label: "Sub-item 3" },
                    ]}
                  />
                </div>
              </div>

              {/* Full Sidebar */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Full Sidebar</h4>
                <div className="bg-white border border-slate-200 rounded-lg w-64 h-[500px] flex flex-col">
                  <div className="flex-1 py-4">
                    <NavItem
                      icon={<CheckCircle2 className="h-5 w-5" />}
                      label="Invitees"
                      status="Invites sent · Tracking RSVP"
                    />
                    <NavItem
                      icon={<CheckCircle2 className="h-5 w-5" />}
                      label="Materials"
                      active={true}
                      hasSubItems={true}
                      subItems={[
                        { label: "Board packet" },
                        { label: "Agenda", active: true },
                        { label: "Supporting documents" },
                      ]}
                    />
                    <NavItem
                      icon={<Circle className="h-5 w-5" />}
                      label="Recording"
                      status="Not started"
                    />
                    <NavItem
                      icon={<Circle className="h-5 w-5" />}
                      label="Minutes"
                      status="Not started"
                    />
                    <NavItem
                      icon={
                        <div className="h-5 w-5 border-[1.5px] border-dashed border-slate-400 rounded-full flex items-center justify-center">
                          <Plus className="h-3 w-3 text-slate-400" />
                        </div>
                      }
                      label="Public page"
                      status="Secondary"
                    />
                    <NavItem
                      icon={
                        <div className="h-5 w-5 border-[1.5px] border-dashed border-slate-400 rounded-full flex items-center justify-center">
                          <Plus className="h-3 w-3 text-slate-400" />
                        </div>
                      }
                      label="Tasks & polls"
                      status="Secondary"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Global Navigation */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-slate-700">Top Global Navigation</h3>
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
              <header className="h-16 px-4 flex items-center justify-between">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="pl-10 pr-4 py-2 w-48 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Right side icons */}
                <div className="flex items-center gap-3">
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <Video className="h-5 w-5 text-slate-500" />
                  </button>
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors relative">
                    <Bell className="h-5 w-5 text-slate-500" />
                  </button>
                  {/* User Avatar */}
                  <button className="h-9 w-9 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-sm font-medium">
                    T
                  </button>
                </div>
              </header>
            </div>
          </div>

          {/* Meeting Header */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-slate-700">Meeting Header</h3>
            
            <div className="grid grid-cols-1 gap-12">
              {/* Default State */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Default State</h4>
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden relative">
                  <MeetingHeader />
                </div>
              </div>

              {/* Expanded State */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Expanded State</h4>
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden relative min-h-[400px]">
                  <MeetingHeader defaultExpanded={true} />
                  <div className="mt-20 p-8 text-center text-slate-400 text-sm">
                    (Content below header to demonstrate overlay behavior)
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Secondary Header */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-slate-700">Secondary Header</h3>
            
            {/* Default with Collaborators */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider">With Collaborators</h4>
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <div className="px-6">
                  <SecondaryHeader 
                    title="Materials" 
                    collaboratorsCount={2}
                    collaborators={[
                      { initials: "A", variant: "blue" },
                      { initials: "M", variant: "purple" }
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* Variation without Collaborators and Ghost Button */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Simple with Ghost Button</h4>
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <div className="px-6">
                  <div className="flex items-center justify-between py-0 mb-6">
                    <h2 className="text-xl font-semibold text-slate-800">Recording</h2>
                    <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors">
                      <Plus className="w-4 h-4" />
                      Add Item
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-slate-700">Table</h3>
            <Table />
          </div>

          {/* Modal */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-slate-700">Modal</h3>
            <p className="text-sm text-slate-600">Confirmation dialogs for critical actions</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Warning Variant */}
              <ModalDemo
                title="Warning Modal"
                variant="warning"
                modalTitle="Replace Existing Agenda?"
                modalMessage="This will discard all current agenda items and load the previous meeting's agenda. This action cannot be undone."
                confirmText="Replace Agenda"
              />

              {/* Danger Variant */}
              <ModalDemo
                title="Danger Modal"
                variant="danger"
                modalTitle="Delete All Items?"
                modalMessage="This will permanently delete all agenda items. This action cannot be undone."
                confirmText="Delete All"
              />

              {/* Info Variant */}
              <ModalDemo
                title="Info Modal"
                variant="info"
                modalTitle="Save Changes?"
                modalMessage="You have unsaved changes. Would you like to save them before continuing?"
                confirmText="Save Changes"
              />
            </div>
          </div>
        </section>
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-800 border-b border-slate-200 pb-2">Icons</h2>
          <p className="text-slate-600">Using {designSystem.icons.library} v{designSystem.icons.version}</p>
          
          <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-10 gap-4">
            {designSystem.icons.common.map((iconName) => {
              const Icon = IconMap[iconName];
              return (
                <div key={iconName} className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-slate-200 hover:border-primary-300 transition-colors group">
                  {Icon ? (
                    <Icon className="w-6 h-6 text-slate-500 group-hover:text-primary-600 mb-2" />
                  ) : (
                    <div className="w-6 h-6 bg-slate-100 rounded-full mb-2" />
                  )}
                  <span className="text-xs text-slate-500 truncate w-full text-center">{iconName}</span>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
