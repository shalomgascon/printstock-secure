import { useState } from 'react';
import {
  Shield,
  Bell,
  Database,
  Lock,
  Key,
  Globe,
  Server,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function Settings() {
  const [settings, setSettings] = useState({
    twoFactorAuth: true,
    sessionTimeout: '30',
    passwordExpiry: '90',
    minPasswordLength: '8',
    loginAlerts: true,
    lowStockAlerts: true,
    orderAlerts: true,
    securityAlerts: true,
    autoBackup: true,
    backupFrequency: 'daily',
  });

  const securityChecklist = [
    { label: 'Two-factor authentication enabled', status: settings.twoFactorAuth },
    { label: 'Session timeout configured', status: true },
    { label: 'Password policy enforced', status: true },
    { label: 'HTTPS enabled', status: true },
    { label: 'Rate limiting active', status: true },
    { label: 'Input validation enabled', status: true },
    { label: 'XSS protection active', status: true },
    { label: 'CSRF protection enabled', status: true },
  ];

  const passedChecks = securityChecklist.filter((c) => c.status).length;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Security Score */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Security Status
              </CardTitle>
              <CardDescription>
                Overall security posture of your application
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-display font-bold text-success">
                {Math.round((passedChecks / securityChecklist.length) * 100)}%
              </div>
              <Badge className="bg-success/10 text-success border-success/20">
                Secure
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {securityChecklist.map((check, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm"
              >
                {check.status ? (
                  <CheckCircle className="h-4 w-4 text-success" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-warning" />
                )}
                <span className={cn(!check.status && 'text-muted-foreground')}>
                  {check.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Authentication Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Authentication Settings
          </CardTitle>
          <CardDescription>
            Configure login and session security policies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">
                Require 2FA for all admin accounts
              </p>
            </div>
            <Switch
              checked={settings.twoFactorAuth}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, twoFactorAuth: checked })
              }
            />
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Select
                value={settings.sessionTimeout}
                onValueChange={(value) =>
                  setSettings({ ...settings, sessionTimeout: value })
                }
              >
                <SelectTrigger id="sessionTimeout">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
              <Select
                value={settings.passwordExpiry}
                onValueChange={(value) =>
                  setSettings({ ...settings, passwordExpiry: value })
                }
              >
                <SelectTrigger id="passwordExpiry">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="minPassword">Minimum Password Length</Label>
            <Select
              value={settings.minPasswordLength}
              onValueChange={(value) =>
                setSettings({ ...settings, minPasswordLength: value })
              }
            >
              <SelectTrigger id="minPassword" className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="8">8 characters</SelectItem>
                <SelectItem value="10">10 characters</SelectItem>
                <SelectItem value="12">12 characters</SelectItem>
                <SelectItem value="16">16 characters</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Passwords must include uppercase, lowercase, numbers, and special characters
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </CardTitle>
          <CardDescription>
            Configure alerts and notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Login Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified of new login activity
              </p>
            </div>
            <Switch
              checked={settings.loginAlerts}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, loginAlerts: checked })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Low Stock Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when items are running low
              </p>
            </div>
            <Switch
              checked={settings.lowStockAlerts}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, lowStockAlerts: checked })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Order Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified of new orders
              </p>
            </div>
            <Switch
              checked={settings.orderAlerts}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, orderAlerts: checked })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Security Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified of suspicious activity
              </p>
            </div>
            <Switch
              checked={settings.securityAlerts}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, securityAlerts: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Backup Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Backup & Recovery
          </CardTitle>
          <CardDescription>
            Configure automatic backups for data protection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Automatic Backups</Label>
              <p className="text-sm text-muted-foreground">
                Automatically backup your data
              </p>
            </div>
            <Switch
              checked={settings.autoBackup}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, autoBackup: checked })
              }
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="backupFrequency">Backup Frequency</Label>
            <Select
              value={settings.backupFrequency}
              onValueChange={(value) =>
                setSettings({ ...settings, backupFrequency: value })
              }
              disabled={!settings.autoBackup}
            >
              <SelectTrigger id="backupFrequency" className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Create Backup Now
            </Button>
            <Button variant="outline" size="sm">
              Restore from Backup
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Server Hardening Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Server Hardening
          </CardTitle>
          <CardDescription>
            Security measures implemented at the server level
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Network Security
              </h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• HTTPS/TLS encryption</li>
                <li>• Firewall configured</li>
                <li>• DDoS protection enabled</li>
                <li>• IP filtering active</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Key className="h-4 w-4" />
                Application Security
              </h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Content Security Policy</li>
                <li>• HTTP security headers</li>
                <li>• SQL injection prevention</li>
                <li>• XSS filtering enabled</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save button */}
      <div className="flex justify-end">
        <Button size="lg">Save Settings</Button>
      </div>
    </div>
  );
}
