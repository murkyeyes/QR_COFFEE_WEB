import { useState, useEffect } from "react";

export default function ModalForm({ isOpen, onClose, mode, onSubmit, productData }) {
    
    // === STATE CHO PRODUCTS ===
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [origin, setOrigin] = useState('');
    const [farm, setFarm] = useState('');
    const [website, setWebsite] = useState('');
    const [expire_date, setExpireDate] = useState('');
    const [price_original, setPriceOriginal] = useState('');
    const [price_sell, setPriceSell] = useState('');
    const [image_url, setImageUrl] = useState('');

    // === STATE MỚI CHO COFFEE_PROFILE ===
    const [tasting_notes, setTastingNotes] = useState('');
    const [acidity, setAcidity] = useState('');
    const [body, setBody] = useState('');
    const [processing_method, setProcessingMethod] = useState('');
    const [roast_level, setRoastLevel] = useState('');

    useEffect(() => {
        if (mode === 'edit' && productData) {
            // Set data cho products
            setName(productData.name ?? '');
            setCategory(productData.category ?? '');
            setOrigin(productData.origin ?? '');
            setFarm(productData.farm ?? '');
            setWebsite(productData.website ?? '');
            setExpireDate(productData.expire_date ? productData.expire_date.split('T')[0] : '');
            setPriceOriginal(productData.price_original ?? '');
            setPriceSell(productData.price_sell ?? '');
            setImageUrl(productData.image_url ?? '');
            
            // Set data cho coffee_profile (lấy từ productData đã JOIN)
            setTastingNotes(productData.tasting_notes ?? '');
            setAcidity(productData.acidity ?? '');
            setBody(productData.body ?? '');
            setProcessingMethod(productData.processing_method ?? '');
            setRoastLevel(productData.roast_level ?? '');

        } else if (mode === 'add') {
            // Reset tất cả state
            setName(''); setCategory(''); setOrigin(''); setFarm('');
            setWebsite(''); setExpireDate(''); setPriceOriginal(''); setPriceSell('');
            setImageUrl('');
            setTastingNotes(''); setAcidity(''); setBody(''); setProcessingMethod(''); setRoastLevel('');
        }
        // Thêm isOpen để reset form khi mở lại "Add" (nếu lần trước là "Edit")
    }, [mode, productData, isOpen]); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Gộp tất cả data lại
            const payload = { 
                name, category, origin, farm, website, expire_date, 
                price_original: Number(price_original) || 0, // Đảm bảo là số
                price_sell: Number(price_sell),
                image_url,
                // Thêm data profile
                tasting_notes, 
                acidity, 
                body, 
                processing_method, 
                roast_level 
            };
            await onSubmit(payload);
        } catch (err) {
            console.error('Error submitting form:', err);
        }
        onClose();
    };

    return (
        // Mở rộng modal và thêm scroll
        <dialog id="my_modal_3" className="modal bg-black/40" open={isOpen}>
            <div className="modal-box max-w-2xl"> 
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={onClose}>✕</button>
                <h3 className="font-bold text-lg py-4">{mode === 'edit' ? 'Edit Product' : 'Add Product'}</h3>
                
                {/* Thêm thanh cuộn cho form */}
                <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto pr-2" id="modal-form">
                    
                    {/* === PHẦN PRODUCTS === */}
                    <div className="divider text-sm font-bold">Thông tin chính</div>
                    
                    <label className="input input-bordered flex items-center my-4 gap-2">
                        Name 
                        <input type="text" className="grow" value={name} onChange={(e) => setName(e.target.value)} required />
                    </label>
                    <div className="flex gap-4">
                        <label className="input input-bordered flex items-center my-4 gap-2 grow">
                            Category 
                            <input type="text" className="grow" value={category} onChange={(e) => setCategory(e.target.value)} />
                        </label>
                        <label className="input input-bordered flex items-center my-4 gap-2 grow">
                            Origin 
                            <input type="text" className="grow" value={origin} onChange={(e) => setOrigin(e.target.value)}/>
                        </label>
                    </div>
                    <label className="input input-bordered flex items-center my-4 gap-2">
                        Link ảnh
                        <input type="text" className="grow" value={image_url} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://... hoặc /ten_anh.png"/>
                    </label>
                    <label className="input input-bordered flex items-center my-4 gap-2">
                        Farm 
                        <input type="text" className="grow" value={farm} onChange={(e) => setFarm(e.target.value)}/>
                    </label>
                    <label className="input input-bordered flex items-center my-4 gap-2">
                        Website 
                        <input type="text" className="grow" value={website} onChange={(e) => setWebsite(e.target.value)}/>
                    </label>
                    <label className="input input-bordered flex items-center my-4 gap-2">
                        Expire Date 
                        <input type="date" className="grow" value={expire_date} onChange={(e) => setExpireDate(e.target.value)}/>
                    </label>
                    <div className="flex gap-4 mb-4">
                        <label className="input input-bordered flex items-center gap-2 grow">
                        Original Price
                        <input type="number" className="grow" value={price_original} onChange={(e) => setPriceOriginal(e.target.value)}/>
                        </label>
                        <label className="input input-bordered flex items-center gap-2 grow">
                        Sell Price
                        <input type="number" className="grow" value={price_sell} onChange={(e) => setPriceSell(e.target.value)} required />
                        </label>
                    </div>

                    {/* === PHẦN COFFEE PROFILE MỚI === */}
                    <div className="divider text-sm font-bold">Hồ sơ hương vị</div>
                    
                    <label className="input input-bordered flex items-center my-4 gap-2">
                        Tasting Notes
                        <input type="text" className="grow" value={tasting_notes} onChange={(e) => setTastingNotes(e.target.value)} placeholder="Hương hoa, cam quýt, trà..."/>
                    </label>
                    <div className="flex gap-4">
                        <label className="input input-bordered flex items-center my-4 gap-2 grow">
                            Acidity (Độ chua)
                            <input type="text" className="grow" value={acidity} onChange={(e) => setAcidity(e.target.value)} placeholder="Cao, Vừa, Thấp..."/>
                        </label>
                        <label className="input input-bordered flex items-center my-4 gap-2 grow">
                            Body (Độ đậm)
                            <input type="text" className="grow" value={body} onChange={(e) => setBody(e.target.value)} placeholder="Dày, Vừa, Mỏng..."/>
                        </label>
                    </div>
                    <div className="flex gap-4">
                        <label className="input input-bordered flex items-center my-4 gap-2 grow">
                            Processing
                            <input type="text" className="grow" value={processing_method} onChange={(e) => setProcessingMethod(e.target.value)} placeholder="Washed, Natural, Honey..."/>
                        </label>
                        <label className="input input-bordered flex items-center my-4 gap-2 grow">
                            Roast Level
                            <input type="text" className="grow" value={roast_level} onChange={(e) => setRoastLevel(e.target.value)} placeholder="Sáng, Vừa, Đậm..."/>
                        </label>
                    </div>

                {/* Phải để trống ở đây để nút submit nằm bên ngoài */}
                </form> 
                <button type="submit" form="modal-form" onClick={handleSubmit} className="btn btn-success w-full mt-4">
                    {mode === 'edit' ? 'Save Changes' : 'Add Product'}
                </button>
            </div>
        </dialog>
    );
}
