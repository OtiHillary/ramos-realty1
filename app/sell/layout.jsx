export default function SellLayout({ children }) {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="bg-blue-800 text-white p-4 flex justify-start">
                <a href="/dashboard" className="text-md me-4 font-light hover:underline my-1">Home</a>
                <a href="/sell" className="text-md me-4 font-light hover:underline my-1">My listings</a>
                <a href="/sell/new-listing" className="text-md me-4 font-light hover:underline my-1">New listing</a>
            </header>
            <main className="flex-grow p-4">
                {children}
            </main>
            <footer className="bg-gray-800 text-white p-4 text-center">
                &copy; {new Date().getFullYear()} Real Estate Platform
            </footer>
        </div>
    );
}