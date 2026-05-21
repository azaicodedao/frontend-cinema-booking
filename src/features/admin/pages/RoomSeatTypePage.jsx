import React, { useState, useEffect, useCallback } from 'react';
import * as adminApi from '../services/admin.api';
import '../../../layouts/AdminLayout.css';

const EMPTY_FORM = { id: '', name: '', surcharge: '' };

const RoomSeatTypePage = () => {
    const [activeTab, setActiveTab] = useState('ROOM'); // 'ROOM' or 'SEAT'
    
    const [roomTypes, setRoomTypes] = useState([]);
    const [seatTypes, setSeatTypes] = useState([]);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [formLoading, setFormLoading] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const [roomRes, seatRes] = await Promise.all([
                adminApi.getRoomTypes(),
                adminApi.getSeatTypes()
            ]);
            setRoomTypes(roomRes.data.data || []);
            setSeatTypes(seatRes.data.data || []);
        } catch (err) {
            console.error(err);
            setError('Lỗi khi tải dữ liệu phụ phí');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const openAddModal = () => {
        setEditMode(false);
        setForm(EMPTY_FORM);
        setShowModal(true);
    };

    const openEditModal = (item) => {
        setEditMode(true);
        setForm({
            id: item.id,
            name: item.name,
            surcharge: item.surcharge
        });
        setShowModal(true);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setFormLoading(true);

        try {
            const payload = {
                name: form.name,
                surcharge: parseFloat(form.surcharge || 0)
            };

            if (activeTab === 'ROOM') {
                if (editMode) {
                    await adminApi.updateRoomType(form.id, payload);
                } else {
                    await adminApi.createRoomType(payload);
                }
            } else {
                if (editMode) {
                    await adminApi.updateSeatType(form.id, payload);
                } else {
                    await adminApi.createSeatType(payload);
                }
            }
            
            setSuccess(editMode ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
            setShowModal(false);
            fetchData();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Lỗi khi lưu dữ liệu');
        } finally {
            setFormLoading(false);
            setTimeout(() => setSuccess(''), 3000);
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleDelete = async (id) => {
        setError('');
        setSuccess('');
        try {
            if (activeTab === 'ROOM') {
                await adminApi.deleteRoomType(id);
            } else {
                await adminApi.deleteSeatType(id);
            }
            setSuccess('Xóa thành công!');
            fetchData();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Lỗi khi xóa dữ liệu');
        } finally {
            setDeleteConfirm(null);
            setTimeout(() => setSuccess(''), 3000);
            setTimeout(() => setError(''), 3000);
        }
    };

    const renderTable = (data) => (
        <div className="admin-table-wrap">
            <table className="admin-table">
                <thead>
                    <tr>
                        <th style={{ width: '80px' }}>ID</th>
                        <th>TÊN LOẠI {activeTab === 'ROOM' ? 'PHÒNG' : 'GHẾ'}</th>
                        <th>PHỤ PHÍ (VNĐ)</th>
                        <th style={{ width: '150px', textAlign: 'center' }}>THAO TÁC</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={4} style={{ textAlign: 'center', padding: '24px', color: 'var(--t3)' }}>
                                Chưa có dữ liệu.
                            </td>
                        </tr>
                    ) : (
                        data.map(item => (
                            <tr key={item.id}>
                                <td style={{ color: 'var(--t2)' }}>#{item.id}</td>
                                <td style={{ fontWeight: 600, color: 'var(--t1)' }}>{item.name}</td>
                                <td style={{ fontWeight: 600, color: 'var(--gold)' }}>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.surcharge || 0)}
                                </td>
                                <td>
                                    <div className="admin-actions-group" style={{ justifyContent: 'center' }}>
                                        <button className="btn-admin-secondary" onClick={() => openEditModal(item)}>
                                            <svg viewBox="0 0 14 14" fill="none" style={{ width: 12, height: 12 }}>
                                                <path d="M9.5 1.5l3 3L4 13H1v-3L9.5 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                                            </svg>
                                            Sửa
                                        </button>
                                        <button className="btn-admin-danger" onClick={() => setDeleteConfirm(item.id)}>
                                            <svg viewBox="0 0 14 14" fill="none" style={{ width: 12, height: 12 }}>
                                                <path d="M2 3.5h10M5 3.5V2.5h4v1M5.5 6v4M8.5 6v4M3 3.5l.7 8h6.6l.7-8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Xóa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );

    return (
        <div>
            <div className="admin-page-header">
                <h1 className="admin-page-title">
                    Quản lý Phụ phí {activeTab === 'ROOM' ? 'Phòng' : 'Ghế'}
                    <span>{activeTab === 'ROOM' ? roomTypes.length : seatTypes.length} loại</span>
                </h1>
                <button className="btn-admin-primary" onClick={openAddModal}>
                    <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14 }}>
                        <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Thêm loại {activeTab === 'ROOM' ? 'phòng' : 'ghế'}
                </button>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <button
                    onClick={() => setActiveTab('ROOM')}
                    style={{
                        padding: '10px 20px',
                        background: activeTab === 'ROOM' ? 'var(--gold)' : 'transparent',
                        color: activeTab === 'ROOM' ? '#000' : 'var(--t2)',
                        border: activeTab === 'ROOM' ? '1px solid var(--gold)' : '1px solid var(--border)',
                        borderRadius: '8px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    Loại Phòng
                </button>
                <button
                    onClick={() => setActiveTab('SEAT')}
                    style={{
                        padding: '10px 20px',
                        background: activeTab === 'SEAT' ? 'var(--gold)' : 'transparent',
                        color: activeTab === 'SEAT' ? '#000' : 'var(--t2)',
                        border: activeTab === 'SEAT' ? '1px solid var(--gold)' : '1px solid var(--border)',
                        borderRadius: '8px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    Loại Ghế
                </button>
            </div>

            {error && (
                <div style={{ color: '#ff4d4f', background: 'rgba(255,77,79,0.1)', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontWeight: 500 }}>
                    {error}
                </div>
            )}
            
            {success && (
                <div style={{ color: '#52c41a', background: 'rgba(82,196,26,0.1)', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontWeight: 500 }}>
                    {success}
                </div>
            )}

            {loading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--t2)' }}>Đang tải dữ liệu...</div>
            ) : (
                renderTable(activeTab === 'ROOM' ? roomTypes : seatTypes)
            )}

            {/* Modal Form */}
            {showModal && (
                <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="admin-modal" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
                        <button className="admin-modal-close" onClick={() => setShowModal(false)}>×</button>
                        <h2 className="admin-modal-title">
                            {editMode ? 'Sửa' : 'Thêm'} loại {activeTab === 'ROOM' ? 'phòng' : 'ghế'}
                        </h2>
                        
                        <form onSubmit={handleSave}>
                            <div className="admin-form-group">
                                <label className="admin-form-label">Tên loại {activeTab === 'ROOM' ? 'phòng' : 'ghế'} *</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="admin-form-input"
                                    value={form.name}
                                    onChange={handleFormChange}
                                    required
                                    autoFocus
                                    placeholder={activeTab === 'ROOM' ? "VD: IMAX, 3D" : "VD: VIP, Sweetbox"}
                                />
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-form-label">Phụ phí (VNĐ) *</label>
                                <input
                                    type="number"
                                    name="surcharge"
                                    className="admin-form-input"
                                    value={form.surcharge}
                                    onChange={handleFormChange}
                                    required
                                    min="0"
                                    placeholder="VD: 50000"
                                />
                            </div>

                            <div className="admin-modal-footer">
                                <button type="button" className="btn-admin-secondary" onClick={() => setShowModal(false)} disabled={formLoading}>
                                    Hủy
                                </button>
                                <button type="submit" className="btn-admin-primary" disabled={formLoading}>
                                    {formLoading ? 'Đang lưu...' : editMode ? 'Cập nhật' : 'Thêm mới'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="admin-modal-overlay" onClick={() => setDeleteConfirm(null)}>
                    <div className="admin-modal admin-confirm-modal" onClick={e => e.stopPropagation()}>
                        <button className="admin-modal-close" onClick={() => setDeleteConfirm(null)}>×</button>
                        <h2 className="admin-modal-title">Xóa loại {activeTab === 'ROOM' ? 'phòng' : 'ghế'}</h2>
                        <p className="admin-confirm-text">
                            Bạn có chắc chắn muốn xóa loại {activeTab === 'ROOM' ? 'phòng' : 'ghế'} này không? Thao tác không thể hoàn tác.
                        </p>
                        <div className="admin-modal-footer">
                            <button className="btn-admin-secondary" onClick={() => setDeleteConfirm(null)}>Hủy</button>
                            <button className="btn-admin-danger" onClick={() => handleDelete(deleteConfirm)}>Xóa</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomSeatTypePage;
