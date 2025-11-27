import React, { useState, useEffect } from 'react';
import { 
  User, ShoppingBag, Truck, ChefHat, LogOut, MapPin, Clock, DollarSign, 
  Plus, Minus, CheckCircle, BarChart3, Users, Package, Sparkles, Bot, 
  Loader2, Navigation, ArrowRight, Phone, Calendar, RefreshCw, AlertCircle, 
  Trash2, Edit2, Save, X, LayoutDashboard, Utensils 
} from 'lucide-react';

// --- MOCK DATA & CONFIG ---
const INITIAL_USERS = [
  { id: 1, name: "System Admin", email: "admin@campus.edu", password: "pass123", role: "admin" },
  { id: 2, name: "Head Chef", email: "chef@campus.edu", password: "pass123", role: "kitchen" },
  { id: 3, name: "Rider Ali", email: "rider@campus.edu", password: "pass123", role: "rider" },
  { id: 4, name: "Student Sarah", email: "student@campus.edu", password: "pass123", role: "student", phone: "0300-1234567" }
];

const INITIAL_MENU_ITEMS = [
  // Desi
  { id: 101, name: "Chicken Biryani", price: 350, category: "Desi Delights", image: "🥘" },
  { id: 102, name: "Chicken Pulao", price: 320, category: "Desi Delights", image: "🍛" },
  { id: 103, name: "Seekh Kabab (4 pcs)", price: 400, category: "Desi Delights", image: "🍖" },
  { id: 104, name: "Chapli Kabab", price: 150, category: "Desi Delights", image: "🥩" },
  { id: 105, name: "Haleem", price: 250, category: "Desi Delights", image: "🥣" },
  // Fast Food
  { id: 201, name: "Zinger Burger", price: 450, category: "Fast Food", image: "🍔" },
  { id: 202, name: "Club Sandwich", price: 300, category: "Fast Food", image: "🥪" },
  { id: 203, name: "Pizza Slice", price: 250, category: "Fast Food", image: "🍕" },
  { id: 204, name: "Chicken Wrap", price: 350, category: "Fast Food", image: "🌯" },
  { id: 205, name: "Alfredo Pasta", price: 550, category: "Fast Food", image: "🍝" },
  // Beverages
  { id: 301, name: "Masala Fries", price: 150, category: "Sips & Snacks", image: "🍟" },
  { id: 302, name: "Karak Chai", price: 80, category: "Sips & Snacks", image: "☕" },
  { id: 303, name: "Mint Margarita", price: 180, category: "Sips & Snacks", image: "🍹" },
  { id: 304, name: "Fresh Juice", price: 200, category: "Sips & Snacks", image: "🥤" },
  { id: 305, name: "Brownie", price: 120, category: "Sips & Snacks", image: "🍩" },
];

const INITIAL_ORDERS = [
    { id: 'ORD-173', studentId: 4, studentName: "Student Sarah", studentPhone: "0300-1234567", items: [{...INITIAL_MENU_ITEMS[0], qty: 1}], total: 350, status: 'OUT', location: "Library Main Gate", date: 'today', time: '19:48' },
    { id: 'ORD-172', studentId: 4, studentName: "Student Sarah", studentPhone: "0300-1234567", items: [{...INITIAL_MENU_ITEMS[7], qty: 2}], total: 160, status: 'OUT', location: "CS Dept Block B", date: 'today', time: '19:29' },
    { id: 'ORD-174', studentId: 4, studentName: "Student Ali", studentPhone: "0300-7654321", items: [{...INITIAL_MENU_ITEMS[2], qty: 1}], total: 400, status: 'OUT', location: "Boys Hostel 2", date: 'today', time: '18:15' },
    { id: 'ORD-171', studentId: 4, studentName: "Student Sarah", studentPhone: "0300-1234567", items: [{...INITIAL_MENU_ITEMS[3], qty: 1}], total: 450, status: 'READY', location: "Girls Hostel 1", date: 'today', time: '15:31' },
    { id: 'ORD-170', studentId: 4, studentName: "Student Sarah", studentPhone: "0300-1234567", items: [{...INITIAL_MENU_ITEMS[1], qty: 1}], total: 320, status: 'DELIVERED', location: "Admin Block", date: 'yesterday', time: '13:40' }
];

// --- LOGIC: DISTANCE MAP FOR ROUTE OPTIMIZATION ---
// Lower number = Closer to Cafeteria
const LOCATION_SEQUENCE = {
  "Main Cafeteria": 0,
  "Admin Block": 2,       // Close
  "CS Dept Block B": 5,   // Medium
  "Girls Hostel 1": 8,    // Far
  "Boys Hostel 2": 10,    // Farther
  "Library Main Gate": 15 // Furthest
};

// --- SIMULATED AI ENGINE ---
const simulateAIResponse = async (prompt, locations = []) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 1. RIDER ROUTE OPTIMIZATION (REAL LOGIC ADDED)
      if (prompt.includes("Sort these campus locations")) {
        if (locations.length > 0) {
          // Count orders per location for Grouping
          const locationCounts = locations.reduce((acc, loc) => {
            acc[loc] = (acc[loc] || 0) + 1;
            return acc;
          }, {});

          const uniqueLocs = Object.keys(locationCounts);
          
          // Sort based on defined distance sequence
          uniqueLocs.sort((a, b) => {
            const distA = LOCATION_SEQUENCE[a] || 99; // Default to far if unknown
            const distB = LOCATION_SEQUENCE[b] || 99;
            return distA - distB;
          });

          // Format with Order Grouping
          const path = uniqueLocs.map(loc => {
             const count = locationCounts[loc];
             return count > 1 ? `${loc} (${count} Orders)` : loc;
          });

          resolve("Cafeteria -> " + path.join(" -> "));
        } else {
          resolve("Cafeteria -> Admin Block -> Library -> Hostels"); 
        }
      }
      // 2. CRAVEBOT RECOMMENDATION
      else {
        const recommendations = [
          "I'd recommend the *Zinger Burger*! It's crispy, filling, and perfect for a quick lunch. 🍔",
          "How about *Chicken Biryani*? It's our bestseller and super spicy! 🥘",
          "You should try the *Club Sandwich*. It's light but keeps you full during classes. 🥪",
          "Go for *Masala Fries* and *Chai*! The ultimate campus comfort food combo. ☕🍟"
        ];
        resolve(recommendations[Math.floor(Math.random() * recommendations.length)]);
      }
    }, 1500); // 1.5s Fake Delay
  });
};

// --- MAIN COMPONENT ---
export default function CampusCraveApp() {
  const [users, setUsers] = useState(INITIAL_USERS);
  
  // --- SYNCED STATE (LocalStorage) ---
  const [menu, setMenu] = useState(() => {
    const saved = localStorage.getItem('cc_menu');
    return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('cc_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [weeklyRevenue, setWeeklyRevenue] = useState(() => {
    const saved = localStorage.getItem('cc_revenue');
    return saved ? JSON.parse(saved) : 320;
  });

  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('student'); 
  const [loginError, setLoginError] = useState(""); 
  const [cart, setCart] = useState([]);

  // --- EFFECT: SYNC DATA ACROSS TABS ---
  useEffect(() => { localStorage.setItem('cc_menu', JSON.stringify(menu)); }, [menu]);
  useEffect(() => { localStorage.setItem('cc_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('cc_revenue', JSON.stringify(weeklyRevenue)); }, [weeklyRevenue]);

  // Tab Listener
  useEffect(() => {
    const handleStorageChange = (e) => {
        if (e.key === 'cc_orders') setOrders(JSON.parse(e.newValue));
        if (e.key === 'cc_menu') setMenu(JSON.parse(e.newValue));
        if (e.key === 'cc_revenue') setWeeklyRevenue(JSON.parse(e.newValue));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // --- EFFECT: CHECK URL FOR AUTO-LOGIN IN NEW TAB ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get('role');
    const emailParam = params.get('email');
    
    if (roleParam && emailParam) {
      const user = users.find(u => u.email === emailParam);
      if (user) {
          setCurrentUser(user);
          window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [users]);

  const handleLogin = (email, password) => {
    setLoginError("");
    const user = users.find(u => u.email === email);
    if (!user) { setLoginError("⚠ Account not found. Please check your email."); return; }
    if (user.password !== password) { setLoginError("⚠ Incorrect password. Please try again."); return; }
    if (user.role !== activeTab) { setLoginError(`⚠ Access Denied. This account is for ${user.role.toUpperCase()}.`); return; }
    
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('role', user.role);
    currentUrl.searchParams.set('email', user.email);
    
    window.open(currentUrl.toString(), '_blank');
  };

  const handleSignup = (name, email, password, phone) => {
    const newUser = { id: users.length + 1, name, email, password, role: 'student', phone };
    setUsers([...users, newUser]);
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('role', 'student');
    currentUrl.searchParams.set('email', email);
    window.open(currentUrl.toString(), '_blank');
  };

  const logout = () => { 
      setCurrentUser(null); 
      setCart([]); 
      setLoginError(""); 
      window.location.href = window.location.pathname;
  };

  // --- LOGIN SCREEN (FULL SCREEN SPLIT DESIGN) ---
  if (!currentUser) {
    return (
      <div className="flex h-screen w-full bg-white font-sans overflow-hidden">
        
        {/* Left Half - Orange Branding */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#ea580c] to-[#c2410c] relative flex-col justify-between p-16 text-white">
          <div className="relative z-10 mt-10">
            <h1 className="text-7xl font-extrabold mb-4 tracking-tight drop-shadow-sm">Campus Crave</h1>
            {/* Tagline with Yellow Vertical Line */}
            <div className="border-l-4 border-yellow-400 pl-6 py-1">
              <p className="text-2xl font-medium text-white opacity-95 tracking-wide">
                Food Delivery System with Route Optimization
              </p>
            </div>
          </div>
          
          <div className="relative z-10 space-y-5 mb-10">
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10 transition-transform hover:scale-[1.02]">
              <div className="bg-white/20 p-2.5 rounded-xl"><Sparkles size={28} className="text-yellow-300" /></div>
              <div><p className="font-bold text-lg">AI Food Concierge</p><p className="text-sm text-orange-100">Get smart meal suggestions</p></div>
            </div>
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10 transition-transform hover:scale-[1.02]">
              <div className="bg-white/20 p-2.5 rounded-xl"><MapPin size={28} /></div>
              <div><p className="font-bold text-lg">Live Tracking</p><p className="text-sm text-orange-100">Know exactly where your food is</p></div>
            </div>
          </div>

          {/* Decoration */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white opacity-5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500 opacity-10 rounded-full -ml-20 -mb-20 blur-3xl"></div>
        </div>

        {/* Right Half - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white h-full overflow-y-auto">
          <div className="w-full max-w-md">
            <div className="mb-10 text-center">
              <div className="inline-flex items-center justify-center p-4 rounded-full bg-orange-50 text-[#ea580c] mb-6 shadow-sm border border-orange-100">
                <User size={40} />
              </div>
              <h2 className="text-4xl font-bold text-gray-900">Welcome</h2>
            </div>

            {/* Role Tabs */}
            <div className="grid grid-cols-4 gap-2 p-1.5 bg-gray-50 rounded-xl mb-8 border border-gray-100">
              {['student', 'kitchen', 'rider', 'admin'].map((role) => (
                <button key={role} onClick={() => { setActiveTab(role); setLoginError(""); }}
                  className={`py-2.5 text-xs font-bold rounded-lg capitalize transition-all ${activeTab === role ? 'bg-white text-gray-900 shadow-md ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}>
                  {role}
                </button>
              ))}
            </div>
            
            <LoginForm role={activeTab} onLogin={handleLogin} onSignup={handleSignup} error={loginError} />
          </div>
        </div>
      </div>
    );
  }

  // --- DASHBOARD ---
  return (
    <div className="min-h-screen w-full bg-gray-50 font-sans">
      <nav className="bg-white border-b sticky top-0 z-50 px-4 lg:px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl text-white bg-[#ea580c] shadow-md shadow-orange-200">
            {currentUser.role === 'student' && <User size={24} />}
            {currentUser.role === 'kitchen' && <ChefHat size={24} />}
            {currentUser.role === 'rider' && <Truck size={24} />}
            {currentUser.role === 'admin' && <BarChart3 size={24} />}
          </div>
          <div className="flex items-center gap-4">
            {/* LOGO SIZE ADJUSTED (w-12 h-12 to match text block height) */}
            <img src="logo.jpg" alt="Logo" className="w-12 h-12 rounded-full object-cover border border-gray-200" />
            <div className="flex flex-col justify-center">
              {/* REVERTED TO ORIGINAL TEXT SIZE (text-xl) */}
              <h1 className="text-xl font-bold text-gray-800 leading-none hidden sm:block">Campus Crave</h1>
              {/* REVERTED TO ORIGINAL SUBTITLE SIZE (text-xs) */}
              <span className={`text-xs font-medium uppercase tracking-wider ${currentUser.role === 'admin' ? 'text-purple-600' : currentUser.role === 'kitchen' ? 'text-green-600' : currentUser.role === 'rider' ? 'text-blue-600' : 'text-[#ea580c]'}`}>
                {currentUser.role} Portal
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-800">{currentUser.name}</p>
            <p className="text-xs text-gray-500">{currentUser.email}</p>
          </div>
          <button onClick={logout} className="bg-gray-100 p-2.5 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors border border-transparent hover:border-red-100"><LogOut size={20} /></button>
        </div>
      </nav>

      <main className="p-4 lg:p-8 w-full max-w-[1920px] mx-auto">
        {currentUser.role === 'student' && (
          <StudentDashboard user={currentUser} menu={menu} cart={cart} setCart={setCart} 
            placeOrder={(order) => { 
                const newOrders = [order, ...orders];
                setOrders(newOrders);
            }} 
            myOrders={orders.filter(o => o.studentId === currentUser.id)} 
          />
        )}
        {currentUser.role === 'kitchen' && <KitchenDashboard orders={orders} updateStatus={(id, status) => setOrders(orders.map(o => o.id === id ? { ...o, status } : o))} />}
        {currentUser.role === 'rider' && <RiderDashboard orders={orders} updateStatus={(id, status) => {
            const updatedOrders = orders.map(o => o.id === id ? { ...o, status } : o);
            setOrders(updatedOrders);
            if (status === 'DELIVERED') {
                const order = orders.find(o => o.id === id);
                if (order) setWeeklyRevenue(prev => prev + order.total);
            }
        }} />}
        {currentUser.role === 'admin' && <AdminDashboard orders={orders} users={users} weeklyRevenue={weeklyRevenue} resetRevenue={() => setWeeklyRevenue(0)} menu={menu} setMenu={setMenu} />}
      </main>
    </div>
  );
}

// --- SUB COMPONENTS ---

function LoginForm({ role, onLogin, onSignup, error }) {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignup) onSignup(formData.name, formData.email, formData.password, formData.phone);
    else onLogin(formData.email, formData.password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded text-sm text-red-700 flex items-start gap-2 animate-in fade-in slide-in-from-top-1"><AlertCircle size={16} className="mt-0.5 shrink-0" /> <p>{error}</p></div>}
      {isSignup && (
        <>
          <div><label className="block text-sm font-medium text-gray-700">Full Name</label><input type="text" required className="mt-1 w-full bg-gray-50 border border-gray-200 rounded-md p-3 focus:ring-2 focus:ring-[#ea580c] outline-none transition-all" placeholder="e.g. Ali Khan" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
          <div><label className="block text-sm font-medium text-gray-700">Phone Number</label><input type="tel" required className="mt-1 w-full bg-gray-50 border border-gray-200 rounded-md p-3 focus:ring-2 focus:ring-[#ea580c] outline-none transition-all" placeholder="0300-1234567" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
        </>
      )}
      <div><label className="block text-sm font-medium text-gray-700">Email Address</label><input type="email" required className="mt-1 w-full bg-gray-50 border border-gray-200 rounded-md p-3 focus:ring-2 focus:ring-[#ea580c] outline-none transition-all" placeholder={`${role}@campus.edu`} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
      <div><label className="block text-sm font-medium text-gray-700">Password</label><input type="password" required className="mt-1 w-full bg-gray-50 border border-gray-200 rounded-md p-3 focus:ring-2 focus:ring-[#ea580c] outline-none transition-all" placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} /></div>
      
      {/* BUTTON COLOR MATCHES LEFT SIDE */}
      <button type="submit" className="w-full py-3.5 px-4 rounded-md shadow-md shadow-orange-100 text-sm font-bold text-white bg-[#ea580c] hover:bg-[#c2410c] transition-transform hover:scale-[1.02]">
        {isSignup ? 'Create Account' : 'Sign In'}
      </button>
      {role === 'student' && <div className="text-center pt-2"><button type="button" onClick={() => setIsSignup(!isSignup)} className="text-sm text-[#ea580c] hover:text-[#c2410c] font-medium">{isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}</button></div>}
      {role !== 'student' && <div className="bg-blue-50 text-blue-800 p-3 rounded-md text-xs flex gap-2 leading-relaxed mt-4 border border-blue-100"><span>ℹ</span> Staff accounts are provisioned by the Administration. Contact IT if you lost credentials.</div>}
    </form>
  );
}

// --- 1. STUDENT DASHBOARD ---
function StudentDashboard({ user, menu, cart, setCart, placeOrder, myOrders }) {
  const groupedMenu = menu.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const addToCart = (item) => {
    const existing = cart.find(i => i.id === item.id);
    setCart(existing ? cart.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i) : [...cart, { ...item, qty: 1 }]);
  };

  const locations = ["Library Main Gate", "CS Dept Block B", "Girls Hostel 1", "Boys Hostel 2", "Admin Block", "Main Cafeteria"];
  const [selectedLoc, setSelectedLoc] = useState(locations[0]);
  const [checkoutPhone, setCheckoutPhone] = useState(user.phone || "");

  const handleCheckout = () => {
    if (cart.length === 0) return;
    if (!checkoutPhone) { alert("Please enter phone number for rider"); return; }
    
    const newOrder = {
      id: `ORD-${Math.floor(Math.random() * 10000)}`,
      studentId: user.id,
      studentName: user.name,
      studentPhone: checkoutPhone,
      items: cart,
      total: cart.reduce((acc, item) => acc + (item.price * item.qty), 0),
      status: 'PENDING',
      location: selectedLoc,
      date: 'today',
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };
    placeOrder(newOrder);
    setCart([]);
    alert("Order Placed! Check 'My Orders' for updates.");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
      <div className="flex-1 space-y-8 w-full">
        <CraveBot menu={menu} />
        {Object.keys(groupedMenu).map(category => (
          <div key={category} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="bg-orange-100 p-2 rounded-lg text-[#ea580c]">{category === 'Desi Delights' ? '🥘' : category === 'Fast Food' ? '🍔' : '🥤'}</span> {category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {groupedMenu[category].map(item => (
                <div key={item.id} className="group bg-gray-50 hover:bg-white p-4 rounded-xl border border-transparent hover:border-orange-200 hover:shadow-md transition-all duration-200 cursor-pointer" onClick={() => addToCart(item)}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-4xl mb-2 transform group-hover:scale-110 transition-transform">{item.image}</div>
                    <button className="bg-white text-gray-800 p-2 rounded-full shadow-sm hover:bg-[#ea580c] hover:text-white transition-colors border"><Plus size={18} /></button>
                  </div>
                  <h4 className="font-bold text-gray-900 text-lg">{item.name}</h4>
                  <p className="text-[#ea580c] font-bold mt-1">PKR {item.price}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="w-full lg:w-96 space-y-6 shrink-0">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><ShoppingBag /> Your Cart</h3>
          {cart.length === 0 ? <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-xl border border-dashed">Cart is empty</div> : 
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="bg-white px-2 py-1 rounded border text-xs font-bold shadow-sm">{item.qty}x</span>
                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold">PKR {item.price * item.qty}</span>
                </div>
              ))}
              <div className="space-y-3 pt-4 border-t">
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Delivery Location</label><select className="w-full p-2 bg-gray-50 border rounded-lg text-sm focus:ring-2 focus:ring-[#ea580c] outline-none" value={selectedLoc} onChange={e => setSelectedLoc(e.target.value)}>{locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}</select></div>
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Contact Phone</label><input type="tel" className="w-full p-2 bg-gray-50 border rounded-lg text-sm focus:ring-2 focus:ring-[#ea580c] outline-none" value={checkoutPhone} onChange={e => setCheckoutPhone(e.target.value)} placeholder="For rider to contact" /></div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2"><span>Total</span><span>PKR {cart.reduce((acc, item) => acc + (item.price * item.qty), 0)}</span></div>
                <button onClick={handleCheckout} className="w-full py-3.5 bg-[#ea580c] text-white rounded-xl font-bold hover:bg-[#c2410c] shadow-lg shadow-orange-200 transition-transform hover:scale-[1.02]">Confirm Order</button>
              </div>
            </div>
          }
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Clock size={18}/> Recent Orders</h3>
          <div className="space-y-3">
            {myOrders.length === 0 ? <p className="text-sm text-gray-400 italic">No history.</p> : myOrders.map(o => (
              <div key={o.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between mb-1"><span className="font-bold text-xs text-gray-500">#{o.id}</span><StatusBadge status={o.status} /></div>
                <p className="text-sm font-medium">{o.items.map(i => i.name).join(', ')}</p>
                <p className="text-xs text-gray-500 mt-1">{o.location}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 2. KITCHEN DASHBOARD ---
function KitchenDashboard({ orders, updateStatus }) {
  const activeOrders = orders.filter(o => ['PENDING', 'PREPARING'].includes(o.status));

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div><h2 className="text-3xl font-bold text-gray-800">Kitchen Display</h2><p className="text-gray-500">Manage preparation flow efficiently</p></div>
        <div className="flex gap-4">
          <div className="bg-red-50 px-4 py-2 rounded-xl border border-red-100"><span className="block text-2xl font-bold text-red-600">{orders.filter(o => o.status === 'PENDING').length}</span><span className="text-xs font-bold text-red-400 uppercase">Pending</span></div>
          <div className="bg-yellow-50 px-4 py-2 rounded-xl border border-yellow-100"><span className="block text-2xl font-bold text-yellow-600">{orders.filter(o => o.status === 'PREPARING').length}</span><span className="text-xs font-bold text-yellow-400 uppercase">Cooking</span></div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {activeOrders.length === 0 ? <div className="col-span-full text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200"><ChefHat size={48} className="mx-auto text-gray-300 mb-4" /><p className="text-xl font-bold text-gray-400">All caught up! No active orders.</p></div> : 
          activeOrders.map(order => (
          <div key={order.id} className={`relative bg-white rounded-2xl shadow-md overflow-hidden border-l-8 transition-all hover:shadow-xl ${order.status === 'PENDING' ? 'border-red-500' : 'border-yellow-500'}`}>
            <div className="p-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center"><div><h4 className="font-bold text-lg text-gray-800">#{order.id}</h4><p className="text-xs text-gray-500 font-mono">Order Time: {order.time}</p></div><span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'PENDING' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{order.status}</span></div>
            <div className="p-5 space-y-3">{order.items.map((item, idx) => (<div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg"><span className="font-bold text-xl text-gray-800 w-10 h-10 flex items-center justify-center bg-white rounded shadow-sm">{item.qty}x</span><span className="text-gray-700 font-medium flex-1 ml-3">{item.name}</span></div>))}</div>
            <div className="p-4 bg-gray-50 grid grid-cols-1 gap-2">
              {order.status === 'PENDING' && <button onClick={() => updateStatus(order.id, 'PREPARING')} className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 shadow-md shadow-red-200 transition-transform hover:scale-[1.02]">Start Cooking 🔥</button>}
              {order.status === 'PREPARING' && <button onClick={() => updateStatus(order.id, 'READY')} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 shadow-md shadow-green-200 transition-transform hover:scale-[1.02]">Mark Ready ✅</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- 3. RIDER DASHBOARD ---
function RiderDashboard({ orders, updateStatus }) {
  const availableJobs = orders.filter(o => o.status === 'READY');
  const myJobs = orders.filter(o => o.status === 'OUT');
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);

  // FIXED: Pass actual locations to AI + 2 Order Restriction
  const optimizeRoute = async () => {
    if(myJobs.length < 2) return alert("⚠ Please accept at least 2 jobs to optimize route! Currently accepted: " + myJobs.length);
    
    setLoading(true);
    const currentLocations = myJobs.map(job => job.location); // Get ALL accepted job locations
    const text = await simulateAIResponse("Sort these campus locations", currentLocations); // Pass to AI
    setRoute(text);
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 w-full">
      {/* AI Route Optimizer - UNIFIED COLOR (Indigo/Purple) */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex justify-between items-start mb-4">
          <div><h2 className="text-2xl font-bold flex items-center gap-2"><Navigation className="text-yellow-400"/> Smart Route Optimizer</h2><p className="text-blue-100">AI-powered path planning for faster deliveries</p></div>
          <button onClick={optimizeRoute} disabled={loading} className="bg-white text-indigo-900 px-5 py-2 rounded-lg font-bold hover:bg-blue-50 transition-colors shadow-lg flex items-center gap-2">
            {loading && <Loader2 className="animate-spin" size={16}/>} Optimize Path
          </button>
        </div>
        {route ? (
          <div className="bg-white/10 p-4 rounded-xl border border-white/20 flex flex-wrap items-center gap-3 animate-in fade-in">
            <span className="bg-blue-900 px-3 py-1 rounded-lg text-sm font-bold">🏠</span>
            {route.split('->').map((loc, i) => (
              <React.Fragment key={i}>
                <ArrowRight size={16} className="text-yellow-400"/>
                <span className="bg-white text-blue-900 px-3 py-1 rounded-lg text-sm font-bold shadow-sm">{loc.trim()}</span>
              </React.Fragment>
            ))}
          </div>
        ) : (
          <div className="h-16 border-2 border-dashed border-white/20 rounded-xl flex items-center justify-center text-blue-200">
            Accept at least 2 jobs & click Optimize to see the magic path!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2"><Truck className="text-blue-600"/> My Active Deliveries ({myJobs.length})</h3>
          {myJobs.length === 0 ? <p className="text-gray-400 italic p-4 bg-white rounded-xl border">No deliveries in progress.</p> : myJobs.map(order => (
            <div key={order.id} className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-blue-600 transition-transform hover:scale-[1.01]">
              <div className="flex justify-between items-start mb-3"><div><h4 className="font-bold text-lg">#{order.id}</h4><p className="text-sm text-gray-500">{order.studentName}</p></div><a href={`tel:${order.studentPhone}`} className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold hover:bg-green-200"><Phone size={12} /> {order.studentPhone}</a></div>
              <div className="bg-gray-50 p-3 rounded-xl mb-4"><p className="text-sm text-gray-600 flex items-center gap-2 mb-1"><MapPin size={16} className="text-red-500"/> <strong>{order.location}</strong></p><p className="text-xs text-gray-500 ml-6">Items: {order.items.length}</p></div>
              <button onClick={() => updateStatus(order.id, 'DELIVERED')} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 shadow-md">Complete Delivery</button>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2"><Package className="text-orange-600"/> Ready for Pickup ({availableJobs.length})</h3>
          {availableJobs.length === 0 ? <p className="text-gray-400 italic p-4 bg-white rounded-xl border">No orders ready yet.</p> : availableJobs.map(order => (
            <div key={order.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 hover:border-orange-300 transition-colors">
              <div className="flex justify-between mb-2"><span className="font-bold text-gray-700">#{order.id}</span><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">Ready</span></div>
              <p className="text-gray-800 font-medium mb-4 flex items-center gap-2"><MapPin size={16}/> {order.location}</p>
              {/* FIXED: ORANGE BUTTON */}
              <button onClick={() => updateStatus(order.id, 'OUT')} className="w-full bg-[#ea580c] text-white py-3 rounded-xl font-bold hover:bg-[#c2410c] shadow-md">Accept Job</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- 4. ADMIN DASHBOARD ---
function AdminDashboard({ orders, users, weeklyRevenue, resetRevenue, menu, setMenu }) {
  const [activeSection, setActiveSection] = useState('orders'); 
  const [viewDate, setViewDate] = useState('today');
  const displayOrders = orders.filter(o => o.date === viewDate);
  const [newItem, setNewItem] = useState({ name: '', price: '', category: 'Fast Food', image: '🍔' });

  const handleAddItem = (e) => { e.preventDefault(); if(!newItem.name || !newItem.price) return; const item = { id: Date.now(), ...newItem, price: Number(newItem.price) }; setMenu([...menu, item]); setNewItem({ name: '', price: '', category: 'Fast Food', image: '🍔' }); alert("Item added!"); };
  const handleDeleteItem = (id) => { setMenu(menu.filter(item => item.id !== id)); };

  return (
    <div className="space-y-8 w-full">
      {/* Header & Navigation (Improved Spacing & Design) */}
      <div className="mb-8 pb-6 border-b border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
          <div>
            <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight">Admin Control Panel</h2>
            <p className="text-gray-500 mt-1">Manage system operations and menu overview</p>
          </div>
          
          {/* Professional Toggle Switch */}
          <div className="bg-gray-100 p-1 rounded-xl flex gap-1">
            <button onClick={() => setActiveSection('orders')} className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all shadow-sm ${activeSection === 'orders' ? 'bg-[#ea580c] text-white shadow-orange-200' : 'bg-transparent text-gray-600 hover:bg-white'}`}>
              <LayoutDashboard size={18}/> Orders & Revenue
            </button>
            <button onClick={() => setActiveSection('menu')} className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all shadow-sm ${activeSection === 'menu' ? 'bg-[#ea580c] text-white shadow-orange-200' : 'bg-transparent text-gray-600 hover:bg-white'}`}>
              <Utensils size={18}/> Manage Menu
            </button>
          </div>
        </div>
        {/* Weekly Revenue Card - FIXED BLACK/DARK THEME */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 rounded-2xl shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-4"><div className="bg-white/10 p-3 rounded-xl"><DollarSign size={32} className="text-green-400"/></div><div><p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Total Weekly Revenue</p><p className="text-4xl font-bold tracking-tight">PKR {weeklyRevenue.toLocaleString()}</p></div></div>
          <button onClick={resetRevenue} className="bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-all flex items-center gap-2 text-sm font-bold" title="Reset"><RefreshCw size={16} /> Start New Week</button>
        </div>
      </div>

      {activeSection === 'orders' ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard icon={<DollarSign />} title="Today's Revenue" value={`PKR ${orders.filter(o => o.date === 'today' && o.status === 'DELIVERED').reduce((a, c) => a + c.total, 0).toLocaleString()}`} color="bg-emerald-500" />
            <StatCard icon={<Package />} title="Orders Today" value={orders.filter(o => o.date === 'today').length} color="bg-blue-500" />
            <StatCard icon={<Users />} title="Total Users" value={users.length} color="bg-violet-500" />
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex border-b border-gray-200 bg-gray-50/50">
              <button onClick={() => setViewDate('today')} className={`flex-1 py-4 text-center font-bold text-sm transition-all ${viewDate === 'today' ? 'text-[#ea580c] border-b-2 border-orange-600 bg-white' : 'text-gray-500 hover:text-gray-700'}`}>Today</button>
              <button onClick={() => setViewDate('yesterday')} className={`flex-1 py-4 text-center font-bold text-sm transition-all ${viewDate === 'yesterday' ? 'text-[#ea580c] border-b-2 border-orange-600 bg-white' : 'text-gray-500 hover:text-gray-700'}`}>Yesterday</button>
            </div>
            {displayOrders.length === 0 ? <div className="text-center py-20 text-gray-400 flex flex-col items-center gap-2"><Package size={48} className="opacity-20"/><p>No orders found for {viewDate}.</p></div> : 
              <div className="divide-y divide-gray-100">
                {displayOrders.map(order => (
                  <div key={order.id} className="p-6 flex flex-col sm:flex-row justify-between items-center hover:bg-orange-50/30 transition-colors gap-6">
                    <div className="flex items-center gap-6 w-full sm:w-auto">
                      <div className="flex flex-col items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl border border-gray-200"><span className="text-xs font-bold text-gray-500 uppercase">Time</span><span className="font-bold text-gray-900">{order.time || '12:00'}</span></div>
                      <div><div className="flex items-center gap-3 mb-1"><h4 className="font-bold text-gray-900 text-lg">#{order.id}</h4><span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-mono border">{(order.items || []).length} Items</span></div><p className="text-gray-500 flex items-center gap-2 text-sm"><User size={14}/> {order.studentName}</p></div>
                    </div>
                    <div className="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-end"><div className="text-right"><p className="text-xs text-gray-400 uppercase font-bold mb-1">Total Amount</p><p className="font-bold text-gray-900 text-xl">PKR {order.total}</p></div><StatusBadge status={order.status} /></div>
                  </div>
                ))}
              </div>
            }
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[600px]">
            <div className="p-6 border-b bg-gray-50/50 flex justify-between items-center"><h3 className="font-bold text-gray-800 flex items-center gap-2"><Utensils size={20}/> Current Menu Items</h3><span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">{menu.length} Items</span></div>
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
              {menu.map(item => (
                <div key={item.id} className="p-4 bg-white border border-gray-100 rounded-xl flex items-start justify-between hover:shadow-md transition-shadow group">
                  <div className="flex items-center gap-4"><div className="text-3xl w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">{item.image}</div><div><p className="font-bold text-gray-800">{item.name}</p><p className="text-xs text-[#ea580c] font-medium bg-orange-50 px-2 py-0.5 rounded-full w-fit mt-1">{item.category}</p></div></div>
                  <div className="flex flex-col items-end gap-2"><span className="font-bold text-gray-900">PKR {item.price}</span><button onClick={() => handleDeleteItem(item.id)} className="text-red-500 bg-red-50 p-2 rounded-lg hover:bg-red-100 transition-colors"><Trash2 size={16} /></button></div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 h-fit p-8 sticky top-24">
             <h3 className="font-bold text-xl text-gray-800 mb-6 flex items-center gap-2"><Plus className="bg-[#ea580c] text-white rounded p-0.5" size={20}/> Add New Item</h3>
             <form onSubmit={handleAddItem} className="space-y-5">
               <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Item Name</label><input required className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#ea580c] outline-none transition-all" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} placeholder="e.g. Beef Burger"/></div>
               <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price (PKR)</label><input required type="number" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#ea580c] outline-none transition-all" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} placeholder="350"/></div>
               <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label><select className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#ea580c] outline-none transition-all" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}><option value="Desi Delights">Desi Delights</option><option value="Fast Food">Fast Food</option><option value="Sips & Snacks">Sips & Snacks</option></select></div>
               <button type="submit" className="w-full bg-[#ea580c] text-white py-4 rounded-xl font-bold hover:bg-[#c2410c] flex justify-center items-center gap-2 shadow-lg transform transition-transform hover:scale-[1.02]">Add to Menu</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SHARED HELPERS ---
function CraveBot({ menu }) {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleAsk = async () => { if(!input) return; setLoading(true); const res = await simulateAIResponse(input); setResponse(res); setLoading(false); };
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
      <div className="relative z-10">
        <h3 className="font-bold text-lg flex items-center gap-2 mb-2"><Bot className="text-yellow-300"/> CraveBot AI</h3>
        <div className="flex gap-2"><input value={input} onChange={e=>setInput(e.target.value)} placeholder="What should I eat?" className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-100 focus:outline-none focus:border-yellow-400"/><button onClick={handleAsk} disabled={loading} className="bg-yellow-400 text-indigo-900 px-4 py-2 rounded-lg font-bold hover:bg-yellow-300 transition-colors">{loading ? <Loader2 className="animate-spin"/> : <Sparkles/>}</button></div>
        {response && <div className="mt-3 bg-white/10 p-3 rounded-lg text-sm text-white animate-in fade-in">{response}</div>}
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`${color} p-4 rounded-xl text-white shadow-lg shadow-${color}/30`}>{icon}</div>
      <div><p className="text-sm text-gray-500 font-medium">{title}</p><p className="text-2xl font-bold text-gray-800">{value}</p></div>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = { PENDING: 'bg-red-100 text-red-700', PREPARING: 'bg-yellow-100 text-yellow-700', READY: 'bg-blue-100 text-blue-700', OUT: 'bg-purple-100 text-purple-700', DELIVERED: 'bg-green-100 text-green-700' };
  return <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${colors[status]}`}>{status}</span>;
}
