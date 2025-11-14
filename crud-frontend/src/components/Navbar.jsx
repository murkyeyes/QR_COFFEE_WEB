// src/components/Navbar.jsx

// Thêm prop 'onScan'
export default function Navbar({ onOpen, onSearch, onScan }) {
    const handleSearchChange = (event) => {
        onSearch(event.target.value);
    }
    
    return (
        <>
           <div className="navbar bg-base-100">
            <div className="navbar-start">
                {/* -- drop down <div></div> */}
                {/* ++ logo */}
                <a className="btn btn-ghost text-xl">ClientManager</a>
                {/* ++ search input */}
                
            </div>
            <div className="navbar-center">
                <div className="form-control">
                    <input type="text" placeholder="Search" onChange={handleSearchChange} className=" input input-bordered w-48 md:w-auto" />
                </div>
                
            </div>
            <div className="navbar-end">
                {/* NÚT SCAN MỚI */}
                <button onClick={onScan} className="btn btn-ghost btn-circle mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                </button>
                
                {/* Đổi tên nút này cho đúng */}
                <button onClick={onOpen} className="btn btn-primary">Add Product</button>
            </div>
            </div>
        </>
    )
}