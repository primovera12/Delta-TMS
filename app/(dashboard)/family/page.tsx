'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Car,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Star,
  ChevronRight,
  Navigation,
  CheckCircle,
  User,
  Bell,
  Shield,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

// Mock data - Family members being monitored
const familyMembers = [
  {
    id: '1',
    name: 'John Smith',
    relationship: 'Father',
    hasActiveTrip: true,
    nextTrip: {
      date: 'Tomorrow',
      time: '10:30 AM',
      destination: 'Memorial Hospital',
    },
    currentTrip: {
      id: 'TR-20260115-012',
      status: 'in-progress',
      driver: 'Mike Johnson',
      driverPhone: '(555) 123-4567',
      eta: '5 min',
      progress: 75,
      pickup: '123 Main St',
      dropoff: 'Memorial Hospital',
    },
  },
  {
    id: '2',
    name: 'Mary Smith',
    relationship: 'Mother',
    hasActiveTrip: false,
    nextTrip: {
      date: 'Friday',
      time: '9:00 AM',
      destination: 'Dialysis Center',
    },
    currentTrip: null,
  },
];

const recentActivity = [
  {
    id: '1',
    member: 'John Smith',
    action: 'Trip completed',
    details: 'Memorial Hospital → Home',
    time: '2 hours ago',
    type: 'success',
  },
  {
    id: '2',
    member: 'Mary Smith',
    action: 'Trip booked',
    details: 'Friday, 9:00 AM to Dialysis Center',
    time: '1 day ago',
    type: 'info',
  },
  {
    id: '3',
    member: 'John Smith',
    action: 'Standing order renewed',
    details: 'Cardiology appointments - Monthly',
    time: '2 days ago',
    type: 'info',
  },
];

export default function FamilyDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Family Dashboard</h1>
          <p className="text-sm text-gray-500">
            Monitor your loved ones&apos; transportation
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Button>
            <Car className="h-4 w-4 mr-2" />
            Book for Family
          </Button>
        </div>
      </div>

      {/* Active Trips Alert */}
      {familyMembers.some((m) => m.hasActiveTrip) && (
        <Card className="border-primary-200 bg-gradient-to-r from-primary-50 to-white">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center animate-pulse">
                <Navigation className="h-5 w-5 text-primary-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Active Trip in Progress</p>
                <p className="text-sm text-gray-500">John Smith is on the way to Memorial Hospital</p>
              </div>
              <Link href="/family/tracking">
                <Button size="sm">
                  Track Live
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Family Members */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Family Members</h2>
        {familyMembers.map((member) => (
          <Card key={member.id}>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                {/* Member Info */}
                <div className="flex items-center gap-4">
                  <Avatar size="lg">
                    <AvatarFallback>
                      {member.name.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-500">{member.relationship}</p>
                    {member.hasActiveTrip && (
                      <Badge variant="in-progress" className="mt-1">
                        On Trip
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Current or Next Trip */}
                <div className="flex-1">
                  {member.currentTrip ? (
                    <div className="p-4 rounded-lg bg-primary-50 border border-primary-200">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium text-primary-900">Current Trip</p>
                        <span className="text-sm font-bold text-primary-600">
                          ETA: {member.currentTrip.eta}
                        </span>
                      </div>
                      <Progress value={member.currentTrip.progress} className="mb-3" />
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{member.currentTrip.pickup} → {member.currentTrip.dropoff}</span>
                        </div>
                        <Button variant="secondary" size="sm">
                          <Phone className="h-4 w-4 mr-1" />
                          Call Driver
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg bg-gray-50">
                      <p className="text-sm font-medium text-gray-500 mb-2">Next Trip</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{member.nextTrip.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{member.nextTrip.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{member.nextTrip.destination}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link href={`/family/members/${member.id}`}>
                    <Button variant="secondary" size="sm">
                      View All
                    </Button>
                  </Link>
                  <Button variant="secondary" size="sm">
                    <Car className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <Button variant="ghost" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.type === 'success'
                        ? 'bg-success-100'
                        : 'bg-info-100'
                    }`}
                  >
                    <CheckCircle
                      className={`h-4 w-4 ${
                        activity.type === 'success'
                          ? 'text-success-600'
                          : 'text-info-600'
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{activity.member}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.details}</p>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="secondary" className="w-full justify-start">
              <Car className="h-4 w-4 mr-3" />
              Book a Ride for Family Member
            </Button>
            <Button variant="secondary" className="w-full justify-start">
              <Calendar className="h-4 w-4 mr-3" />
              View All Upcoming Trips
            </Button>
            <Button variant="secondary" className="w-full justify-start">
              <Users className="h-4 w-4 mr-3" />
              Manage Family Members
            </Button>
            <Button variant="secondary" className="w-full justify-start">
              <Bell className="h-4 w-4 mr-3" />
              Notification Settings
            </Button>
            <Button variant="secondary" className="w-full justify-start">
              <Shield className="h-4 w-4 mr-3" />
              Privacy & Permissions
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Stay Informed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-gray-50">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center">
                <Bell className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Real-time Updates</p>
                <p className="text-sm text-gray-500">
                  Get notified when trips start, complete, or if there are any delays
                </p>
              </div>
            </div>
            <Button variant="secondary">
              Configure
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
