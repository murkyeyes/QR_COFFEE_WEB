import { useState, useEffect } from "react";
import axios from "axios";

export default function ModalForm({ isOpen, onClose, mode, batchData, onSubmit }) {
    
    // Reference data
    const [varieties, setVarieties] = useState([]);
    const [farms, setFarms] = useState([]);
    const [processingMethods, setProcessingMethods] = useState([]);
    const [roastLevels, setRoastLevels] = useState([]);
    
    // Batch fields
    const [variety_id, setVarietyId] = useState('');
    const [farm_id, setFarmId] = useState('');
    const [method_id, setMethodId] = useState('');
    const [level_id, setLevelId] = useState('');
    const [harvest_date, setHarvestDate] = useState('');
    const [roast_date, setRoastDate] = useState('');
    const [expiry_date, setExpiryDate] = useState('');
    const [grade, setGrade] = useState('');
    const [altitude_m, setAltitudeM] = useState('');
    const [weight_kg, setWeightKg] = useState('');
    const [certification_code, setCertificationCode] = useState('');
    
    // Coffee profile fields
    const [tasting_notes, setTastingNotes] = useState('');
    const [acidity, setAcidity] = useState('');
    const [body, setBody] = useState('');
    const [sweetness, setSweetness] = useState('');
    const [aftertaste, setAftertaste] = useState('');
    const [cupping_score, setCuppingScore] = useState('');
    
    // Price fields
    const [price_original, setPriceOriginal] = useState('');
    const [price_sell, setPriceSell] = useState('');

    // Fetch reference data on mount
    useEffect(() => {
        const fetchReferenceData = async () => {
            try {
                const [varietiesRes, farmsRes, methodsRes, levelsRes] = await Promise.all([
                    axios.get('http://localhost:3000/api/reference/varieties'),
                    axios.get('http://localhost:3000/api/reference/farms'),
                    axios.get('http://localhost:3000/api/reference/processing-methods'),
                    axios.get('http://localhost:3000/api/reference/roast-levels')
                ]);
                setVarieties(varietiesRes.data);
                setFarms(farmsRes.data);
                setProcessingMethods(methodsRes.data);
                setRoastLevels(levelsRes.data);
            } catch (error) {
                console.error('Error fetching reference data:', error);
            }
        };
        fetchReferenceData();
    }, []);

    // Populate form when editing
    useEffect(() => {
        if (mode === 'edit' && batchData) {
            setVarietyId(batchData.variety_id ?? '');
            setFarmId(batchData.farm_id ?? '');
            setMethodId(batchData.method_id ?? '');
            setLevelId(batchData.level_id ?? '');
            setHarvestDate(batchData.harvest_date ? batchData.harvest_date.split('T')[0] : '');
            setRoastDate(batchData.roast_date ? batchData.roast_date.split('T')[0] : '');
            setExpiryDate(batchData.expiry_date ? batchData.expiry_date.split('T')[0] : '');
            setGrade(batchData.grade ?? '');
            setAltitudeM(batchData.altitude_m ?? '');
            setWeightKg(batchData.weight_kg ?? '');
            setCertificationCode(batchData.certification_code ?? '');
            
            setTastingNotes(batchData.tasting_notes ?? '');
            setAcidity(batchData.acidity ?? '');
            setBody(batchData.body ?? '');
            setSweetness(batchData.sweetness ?? '');
            setAftertaste(batchData.aftertaste ?? '');
            setCuppingScore(batchData.cupping_score ?? '');
            
            setPriceOriginal(batchData.price_original ?? '');
            setPriceSell(batchData.price_sell ?? '');
        } else if (mode === 'add') {
            // Reset form
            setVarietyId(''); setFarmId(''); setMethodId(''); setLevelId('');
            setHarvestDate(''); setRoastDate(''); setExpiryDate('');
            setGrade(''); setAltitudeM(''); setWeightKg(''); setCertificationCode('');
            setTastingNotes(''); setAcidity(''); setBody(''); setSweetness('');
            setAftertaste(''); setCuppingScore('');
            setPriceOriginal(''); setPriceSell('');
        }
    }, [mode, batchData, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                variety_id: Number(variety_id),
                farm_id: Number(farm_id),
                method_id: method_id ? Number(method_id) : null,
                level_id: level_id ? Number(level_id) : null,
                harvest_date,
                roast_date: roast_date || null,
                expiry_date,
                grade: grade || null,
                altitude_m: altitude_m ? Number(altitude_m) : null,
                weight_kg: weight_kg ? Number(weight_kg) : null,
                certification_code: certification_code || null,
                // Profile
                tasting_notes,
                acidity,
                body,
                sweetness,
                aftertaste,
                cupping_score: cupping_score ? Number(cupping_score) : null,
                // Prices
                price_original: price_original ? Number(price_original) : null,
                price_sell: price_sell ? Number(price_sell) : null
            };
            await onSubmit(payload);
        } catch (err) {
            console.error('Error submitting form:', err);
        }
        onClose();
    };

    return (
        <dialog id="batch_modal" className="modal bg-black/40" open={isOpen}>
            <div className="modal-box max-w-4xl">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={onClose}>✕</button>
                <h3 className="font-bold text-lg py-4">
                    {mode === 'edit' ? 'Cập nhật Lô Sản Phẩm' : 'Thêm Lô Sản Phẩm Mới'}
                </h3>
                
                <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto pr-2">
                    
                    {/* === THÔNG TIN CƠ BẢN === */}
                    <div className="divider text-sm font-bold">Thông tin lô</div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text">Giống cà phê *</span></div>
                            <div className="flex gap-2">
                                <select className="select select-bordered flex-1" value={variety_id} onChange={(e) => setVarietyId(e.target.value)} required>
                                    <option value="">-- Chọn giống --</option>
                                    {varieties.map(v => <option key={v.variety_id} value={v.variety_id}>{v.name}</option>)}
                                </select>
                                <button type="button" className="btn btn-square btn-outline" onClick={() => {
                                    const name = prompt('Tên giống cà phê mới:');
                                    if (name) {
                                        axios.post('http://localhost:3000/api/reference/varieties', { name })
                                            .then(res => {
                                                setVarieties([...varieties, res.data]);
                                                setVarietyId(res.data.variety_id);
                                            })
                                            .catch(err => alert('Lỗi: ' + err.message));
                                    }
                                }}>+</button>
                            </div>
                        </label>
                        
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text">Trang trại *</span></div>
                            <div className="flex gap-2">
                                <select className="select select-bordered flex-1" value={farm_id} onChange={(e) => setFarmId(e.target.value)} required>
                                    <option value="">-- Chọn trang trại --</option>
                                    {farms.map(f => <option key={f.farm_id} value={f.farm_id}>{f.name}</option>)}
                                </select>
                                <button type="button" className="btn btn-square btn-outline" onClick={() => {
                                    const name = prompt('Tên trang trại mới:');
                                    if (name) {
                                        axios.post('http://localhost:3000/api/reference/farms', { name })
                                            .then(res => {
                                                setFarms([...farms, res.data]);
                                                setFarmId(res.data.farm_id);
                                            })
                                            .catch(err => alert('Lỗi: ' + err.message));
                                    }
                                }}>+</button>
                            </div>
                        </label>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text">Phương pháp chế biến</span></div>
                            <div className="flex gap-2">
                                <select className="select select-bordered flex-1" value={method_id} onChange={(e) => setMethodId(e.target.value)}>
                                    <option value="">-- Chọn phương pháp --</option>
                                    {processingMethods.map(m => <option key={m.method_id} value={m.method_id}>{m.name}</option>)}
                                </select>
                                <button type="button" className="btn btn-square btn-outline" onClick={() => {
                                    const name = prompt('Tên phương pháp chế biến:');
                                    if (name) {
                                        axios.post('http://localhost:3000/api/reference/processing-methods', { name })
                                            .then(res => {
                                                setProcessingMethods([...processingMethods, res.data]);
                                                setMethodId(res.data.method_id);
                                            })
                                            .catch(err => alert('Lỗi: ' + err.message));
                                    }
                                }}>+</button>
                            </div>
                        </label>
                        
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text">Mức rang</span></div>
                            <div className="flex gap-2">
                                <select className="select select-bordered flex-1" value={level_id} onChange={(e) => setLevelId(e.target.value)}>
                                    <option value="">-- Chọn mức rang --</option>
                                    {roastLevels.map(l => <option key={l.level_id} value={l.level_id}>{l.name}</option>)}
                                </select>
                                <button type="button" className="btn btn-square btn-outline" onClick={() => {
                                    const name = prompt('Tên mức rang:');
                                    if (name) {
                                        axios.post('http://localhost:3000/api/reference/roast-levels', { name })
                                            .then(res => {
                                                setRoastLevels([...roastLevels, res.data]);
                                                setLevelId(res.data.level_id);
                                            })
                                            .catch(err => alert('Lỗi: ' + err.message));
                                    }
                                }}>+</button>
                            </div>
                        </label>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mt-4">
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text">Ngày thu hoạch *</span></div>
                            <input type="date" className="input input-bordered" value={harvest_date} onChange={(e) => setHarvestDate(e.target.value)} required />
                        </label>
                        
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text">Ngày rang</span></div>
                            <input type="date" className="input input-bordered" value={roast_date} onChange={(e) => setRoastDate(e.target.value)} />
                        </label>
                        
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text">Hạn sử dụng *</span></div>
                            <input type="date" className="input input-bordered" value={expiry_date} onChange={(e) => setExpiryDate(e.target.value)} required />
                        </label>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 mt-4">
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text">Grade</span></div>
                            <select className="select select-bordered select-sm" value={grade} onChange={(e) => setGrade(e.target.value)}>
                                <option value="">-</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                            </select>
                        </label>
                        
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text">Độ cao (m)</span></div>
                            <input type="number" className="input input-bordered input-sm" value={altitude_m} onChange={(e) => setAltitudeM(e.target.value)} />
                        </label>
                        
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text">Khối lượng (kg)</span></div>
                            <input type="number" step="0.01" className="input input-bordered input-sm" value={weight_kg} onChange={(e) => setWeightKg(e.target.value)} />
                        </label>
                        
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text">Mã chứng nhận</span></div>
                            <input type="text" className="input input-bordered input-sm" value={certification_code} onChange={(e) => setCertificationCode(e.target.value)} />
                        </label>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text">Giá gốc (VNĐ)</span></div>
                            <input type="number" className="input input-bordered" value={price_original} onChange={(e) => setPriceOriginal(e.target.value)} placeholder="100000" />
                        </label>
                        
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text">Giá bán (VNĐ)</span></div>
                            <input type="number" className="input input-bordered" value={price_sell} onChange={(e) => setPriceSell(e.target.value)} placeholder="150000" />
                        </label>
                    </div>
                    
                    {/* === HỒ SƠ HƯƠNG VỊ === */}
                    <div className="divider text-sm font-bold mt-6">Hồ sơ hương vị</div>
                    
                    <label className="form-control w-full">
                        <div className="label"><span className="label-text">Tasting Notes</span></div>
                        <input type="text" className="input input-bordered" value={tasting_notes} onChange={(e) => setTastingNotes(e.target.value)} placeholder="Sô-cô-la, hoa quả, mật ong..." />
                    </label>
                    
                    <div className="grid grid-cols-3 gap-4 mt-4">
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text">Acidity (Độ chua)</span></div>
                            <input type="text" className="input input-bordered input-sm" value={acidity} onChange={(e) => setAcidity(e.target.value)} placeholder="Cao, Vừa, Thấp" />
                        </label>
                        
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text">Body (Độ đậm)</span></div>
                            <input type="text" className="input input-bordered input-sm" value={body} onChange={(e) => setBody(e.target.value)} placeholder="Dày, Vừa, Nhẹ" />
                        </label>
                        
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text">Sweetness (Độ ngọt)</span></div>
                            <input type="text" className="input input-bordered input-sm" value={sweetness} onChange={(e) => setSweetness(e.target.value)} placeholder="Cao, Vừa, Thấp" />
                        </label>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text">Aftertaste (Hậu vị)</span></div>
                            <input type="text" className="input input-bordered input-sm" value={aftertaste} onChange={(e) => setAftertaste(e.target.value)} placeholder="Kéo dài, ngọt nhẹ..." />
                        </label>
                        
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text">Cupping Score (0-100)</span></div>
                            <input type="number" step="0.1" className="input input-bordered input-sm" value={cupping_score} onChange={(e) => setCuppingScore(e.target.value)} />
                        </label>
                    </div>
                    
                </form>
                
                <button type="submit" form="batch-form" onClick={handleSubmit} className="btn btn-success w-full mt-6">
                    {mode === 'edit' ? 'Lưu thay đổi' : 'Thêm lô mới'}
                </button>
            </div>
        </dialog>
    );
}
