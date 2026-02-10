import React, { useState } from 'react';
import { ArrowUp, CircleCheck } from 'lucide-react';
import Avatar from './Avatar';

interface TableRowData {
  id: string;
  status: 'no_signal' | 'offline' | 'online';
  signalName: string;
  severity: 'Medium' | 'Huge' | 'Minor' | 'Negligible';
  stage: 'Triaged' | 'Not triaged';
  schedule: string;
  teamLead: string;
  selected?: boolean;
}

const initialSampleData: TableRowData[] = [
  {
    id: '1',
    status: 'no_signal',
    signalName: 'Astrid: NE shared managed',
    severity: 'Medium',
    stage: 'Triaged',
    schedule: '0:33',
    teamLead: 'Chase Nguyen'
  },
  {
    id: '2',
    status: 'offline',
    signalName: 'Cosmo: prod shared ares',
    severity: 'Huge',
    stage: 'Triaged',
    schedule: '0:39',
    teamLead: 'Brie Furman'
  },
  {
    id: '3',
    status: 'online',
    signalName: 'Phoenix: prod shared lyra-lists',
    severity: 'Minor',
    stage: 'Not triaged',
    schedule: '3:12',
    teamLead: 'Jeremy Lake'
  },
  {
    id: '4',
    status: 'online',
    signalName: 'Sirius: NW prod shared locations',
    severity: 'Negligible',
    stage: 'Triaged',
    schedule: '13:18',
    teamLead: 'Angelica Howards'
  }
];

export default function Table() {
  const [data, setData] = useState<TableRowData[]>(initialSampleData);

  const allSelected = data.length > 0 && data.every(row => row.selected);
  const isIndeterminate = data.some(row => row.selected) && !allSelected;

  const toggleAll = () => {
    setData(currentData =>
      currentData.map(row => ({ ...row, selected: !allSelected }))
    );
  };

  const toggleRow = (id: string) => {
    setData(currentData =>
      currentData.map(row =>
        row.id === id ? { ...row, selected: !row.selected } : row
      )
    );
  };

  const getStatusIcon = (status: TableRowData['status']) => {
    switch (status) {
      case 'no_signal':
        return <span className="text-slate-600">No signal</span>;
      case 'offline':
        return <span className="text-slate-600">Offline</span>;
      case 'online':
        return <span className="text-slate-600">Online</span>;
    }
  };

  return (
    <div className="w-full overflow-hidden bg-white border border-slate-200 rounded-lg shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="p-4 w-12">
              <input 
                type="checkbox"
                checked={allSelected}
                ref={input => {
                  if (input) {
                    input.indeterminate = isIndeterminate;
                  }
                }}
                onChange={toggleAll}
                className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
              />
            </th>
            <th className="p-4 text-sm font-semibold text-slate-900">Status</th>
            <th className="p-4 text-sm font-semibold text-slate-900">Signal Name</th>
            <th className="p-4 text-sm font-semibold text-slate-900">Severity</th>
            <th className="p-4 text-sm font-semibold text-slate-900">Stage</th>
            <th className="p-4 text-sm font-semibold text-slate-900">
              <div className="flex items-center gap-1 cursor-pointer hover:text-slate-700">
                <ArrowUp className="w-3 h-3 text-slate-900" />
                Schedule
              </div>
            </th>
            <th className="p-4 text-sm font-semibold text-slate-900">Team Lead</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((row) => (
            <tr 
              key={row.id} 
              className={`hover:bg-slate-50 transition-colors ${row.selected ? 'bg-red-50/30' : ''}`}
            >
              <td className="p-4 relative">
                {row.selected && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
                )}
                <input 
                  type="checkbox" 
                  checked={!!row.selected}
                  onChange={() => toggleRow(row.id)}
                  className={`w-5 h-5 rounded border-2 ${
                    row.selected 
                      ? 'border-red-500 text-red-500 focus:ring-red-500' 
                      : 'border-slate-300 text-slate-600 focus:ring-slate-500'
                  } cursor-pointer transition-colors`}
                />
              </td>
              <td className="p-4 text-sm font-medium">{getStatusIcon(row.status)}</td>
              <td className="p-4 text-sm text-slate-600">{row.signalName}</td>
              <td className="p-4 text-sm text-slate-600">{row.severity}</td>
              <td className="p-4 text-sm text-slate-600">{row.stage}</td>
              <td className="p-4 text-sm text-slate-900 font-medium text-right pr-12">{row.schedule}</td>
              <td className="p-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Avatar 
                    initials={row.teamLead[0]} 
                    size="md" 
                    variant={['teal', 'blue', 'purple'][parseInt(row.id) % 3] as 'teal' | 'blue' | 'purple'}
                  />
                  {row.teamLead}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Invitees table with columns: name, email, RSVP status, Attendance
interface InviteeRow {
  id: string;
  name: string;
  email: string;
  rsvpStatus: 'Accepted' | 'Declined' | 'Pending';
  attendance: 'Present' | 'Absent' | '-';
  selected?: boolean;
}

const initialInviteeData: InviteeRow[] = [
  { id: '1', name: 'Sarah Chen', email: 'sarah.chen@company.com', rsvpStatus: 'Accepted', attendance: 'Present' },
  { id: '2', name: 'Marcus Johnson', email: 'marcus.j@company.com', rsvpStatus: 'Accepted', attendance: '-' },
  { id: '3', name: 'Elena Rodriguez', email: 'elena.r@company.com', rsvpStatus: 'Pending', attendance: '-' },
  { id: '4', name: 'James Wilson', email: 'j.wilson@company.com', rsvpStatus: 'Declined', attendance: 'Absent' },
];

export function InviteesTable() {
  const [invitees, setInvitees] = useState<InviteeRow[]>(initialInviteeData);
  const [attendedIds, setAttendedIds] = useState<Set<string>>(new Set());

  const allSelected = invitees.length > 0 && invitees.every(row => row.selected);
  const isIndeterminate = invitees.some(row => row.selected) && !allSelected;

  const toggleAll = () => {
    setInvitees(currentInvitees =>
      currentInvitees.map(row => ({ ...row, selected: !allSelected }))
    );
  };

  const toggleRow = (id: string) => {
    setInvitees(currentInvitees =>
      currentInvitees.map(row =>
        row.id === id ? { ...row, selected: !row.selected } : row
      )
    );
  };

  const toggleAttendance = (id: string) => {
    setAttendedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getRsvpBadgeClass = (status: InviteeRow['rsvpStatus']) => {
    switch (status) {
      case 'Accepted': return 'bg-green-100 text-green-800';
      case 'Declined': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-amber-100 text-amber-800';
    }
  };

  return (
    <div className="w-full overflow-hidden bg-white border border-slate-200 rounded-lg shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="p-4 w-12">
              <input 
                type="checkbox"
                checked={allSelected}
                ref={input => {
                  if (input) {
                    input.indeterminate = isIndeterminate;
                  }
                }}
                onChange={toggleAll}
                className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
              />
            </th>
            <th className="p-4 text-sm font-semibold text-slate-900">Name</th>
            <th className="p-4 text-sm font-semibold text-slate-900">Email</th>
            <th className="p-4 text-sm font-semibold text-slate-900">RSVP Status</th>
            <th className="p-4 text-sm font-semibold text-slate-900 w-40">Attendance</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {invitees.map((row) => (
            <tr key={row.id} className="hover:bg-slate-50 transition-colors">
              <td className="p-4">
                <input 
                  type="checkbox"
                  checked={!!row.selected}
                  onChange={() => toggleRow(row.id)}
                  className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                />
              </td>
              <td className="p-4 text-sm font-medium text-slate-900">
                <div className="flex items-center gap-2">
                  <Avatar
                    initials={row.name[0]}
                    size="sm"
                    variant={['teal', 'blue', 'purple'][parseInt(row.id) % 3] as 'teal' | 'blue' | 'purple'}
                  />
                  {row.name}
                </div>
              </td>
              <td className="p-4 text-sm text-slate-600">{row.email}</td>
              <td className="p-4">
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getRsvpBadgeClass(row.rsvpStatus)}`}>
                  {row.rsvpStatus}
                </span>
              </td>
              <td className="p-4 text-slate-600 w-40">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleAttendance(row.id)}
                    className="pt-2 pb-2 pl-0 pr-0 rounded-lg hover:bg-slate-100 transition-colors"
                    aria-label={attendedIds.has(row.id) ? 'Mark as not attended' : 'Mark as attended'}
                  >
                    {attendedIds.has(row.id) ? (
                      <CircleCheck className="h-5 w-5 text-green-600" aria-hidden />
                    ) : (
                      <CircleCheck className="h-5 w-5 text-slate-300" aria-hidden />
                    )}
                  </button>
                  {attendedIds.has(row.id) && (
                    <span className="text-sm font-normal text-slate-600">Attended</span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
