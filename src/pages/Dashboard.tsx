import React from 'react';
import { UploadCloud, RefreshCw, Calendar, Settings, Home, LogOut } from 'lucide-react';
import { useAuth } from '@contexts/AuthContext';
import { useShop } from '@contexts/ShopContext';
import { useToast } from '@contexts/ToastContext';
import { supabase } from '@lib/supabase';
import { Card } from '@ui/Card';

// Sidebar navigation items
const NAV_ITEMS = [
	{ name: 'Dashboard', icon: Home, link: '/' },
	{ name: 'Upload Design', icon: UploadCloud, link: '/upload' },
	{ name: 'Sync Now', icon: RefreshCw, link: '/sync' },
	{ name: 'Schedule Drop', icon: Calendar, link: '/drops' },
	{ name: 'Settings', icon: Settings, link: '/settings', adminOnly: true },
];

function Sidebar() {
	const { isAdmin } = useAuth();
	return (
		<div className="w-64 bg-gray-900 text-white min-h-screen p-4 flex flex-col">
			<h2 className="text-2xl font-bold mb-8">Menu</h2>
			<nav>
				<ul>
					{NAV_ITEMS.filter(item => !item.adminOnly || isAdmin).map(item => {
						const Icon = item.icon;
						return (
							<li key={item.name} className="mb-6">
								<button
									onClick={() => window.location.href = item.link}
									className="flex items-center space-x-3 hover:text-gray-300"
								>
									<Icon className="h-5 w-5" />
									<span>{item.name}</span>
								</button>
							</li>
						);
					})}
				</ul>
			</nav>
			<div className="mt-auto">
				<button
					onClick={() => window.location.href = '/logout'}
					className="flex items-center space-x-3 hover:text-gray-300"
				>
					<LogOut className="h-5 w-5" />
					<span>Logout</span>
				</button>
			</div>
		</div>
	);
}

function MainContent() {
	const { user } = useAuth();
	const { currentShop } = useShop();
	const { showToast } = useToast();
	const [stats, setStats] = React.useState({
		totalDesigns: 0,
		totalCollections: 0,
		scheduledDrops: 0,
		pendingSync: 0,
	});

	React.useEffect(() => {
		const loadStats = async () => {
			if (!currentShop?.id) return;
			try {
				const { data: shopData, error: shopError } = await supabase
					.from('shops')
					.select(`
						id,
						designs:designs(count),
						collections:collections(count),
						drops:scheduled_drops(count),
						sync_logs:sync_logs(count)
					`)
					.eq('id', currentShop.id)
					.single();
				if (shopError) throw shopError;
				setStats({
					totalDesigns: shopData.designs[0]?.count || 0,
					totalCollections: shopData.collections[0]?.count || 0,
					scheduledDrops: shopData.drops[0]?.count || 0,
					pendingSync: shopData.sync_logs[0]?.count || 0,
				});
			} catch (error) {
				showToast('Failed to load stats', 'error');
			}
		};
		loadStats();
	}, [currentShop, showToast]);

	return (
		<div className="flex-1 p-8 bg-gray-100 min-h-screen">
			<header className="mb-10">
				<h1 className="text-3xl font-bold">Dashboard</h1>
				<p className="text-gray-600">Welcome, {user?.name}</p>
			</header>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				<Card className="p-6">
					<h3 className="text-lg font-medium">Total Designs</h3>
					<p className="text-3xl font-bold mt-2">{stats.totalDesigns}</p>
				</Card>
				<Card className="p-6">
					<h3 className="text-lg font-medium">Collections</h3>
					<p className="text-3xl font-bold mt-2">{stats.totalCollections}</p>
				</Card>
				<Card className="p-6">
					<h3 className="text-lg font-medium">Scheduled Drops</h3>
					<p className="text-3xl font-bold mt-2">{stats.scheduledDrops}</p>
				</Card>
				<Card className="p-6">
					<h3 className="text-lg font-medium">Pending Sync</h3>
					<p className="text-3xl font-bold mt-2">{stats.pendingSync}</p>
				</Card>
			</div>
			{/* ...additional main content if needed... */}
		</div>
	);
}

export function Dashboard() {
	return (
		<div className="flex">
			<Sidebar />
			<MainContent />
		</div>
	);
}
