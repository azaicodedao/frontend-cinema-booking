import React, { useState, useEffect } from 'react';
import * as adminApi from '../services/admin.api';
import '../../../layouts/AdminLayout.css';

const ROOM_TYPES = ['IMAX', '2D', '3D'];
const ROOM_TYPE_LABELS = { IMAX: 'IMAX', '2D': '2D', '3D': '3D' };

const EMPTY_FORM = { name: '', totalRows: '', totalCols: '', type: 'IMAX' };

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editRoom, setEditRoom] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formLoading, setFormLoading] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [seatModal, setSeatModal] = useState(null);
  const [seatsLoading, setSeatsLoading] = useState(false);
  const [roomSeats, setRoomSeats] = useState([]);
  const [seatSaveLoading, setSeatSaveLoading] = useState(false);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getRooms();
      setRooms(res.data.data || []);
    } catch (e) {
      showError('Không thể tải danh sách phòng chiếu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRooms(); }, []);

  const showSuccess = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); };
  const showError = (msg) => { setError(msg); setTimeout(() => setError(''), 3000); };

  const openCreate = () => { setEditRoom(null); setForm(EMPTY_FORM); setShowModal(true); };

  // SỬA: Thêm fallback r.type đề phòng backend trả về field type thay vì roomType
  const openEdit = (r) => {
    setEditRoom(r);
    setForm({
      name: r.name,
      totalRows: r.totalRows || '',
      totalCols: r.totalCols || '',
      type: r.type || 'IMAX'  // Đổi thành r.type
    });
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditRoom(null); setForm(EMPTY_FORM); };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');
    try {
      const payload = {
        name: form.name,
        totalRows: parseInt(form.totalRows),
        totalCols: parseInt(form.totalCols),
        type: form.type, // Đổi thành form.type
      };
      if (editRoom) {
        await adminApi.updateRoom(editRoom.id, payload);
        showSuccess('Đã cập nhật phòng chiếu thành công');
      } else {
        await adminApi.createRoom(payload);
        showSuccess('Đã thêm phòng chiếu. Sơ đồ ghế đã được tạo tự động.');
      }
      closeModal();
      fetchRooms();
    } catch (e) {
      showError(e.response?.data?.message || 'Không thể thay đổi cấu hình ghế khi phòng đang có suất chiếu được lên lịch.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await adminApi.deleteRoom(deleteConfirm.id);
      showSuccess('Xoá phòng thành công');
      setDeleteConfirm(null);
      fetchRooms();
    } catch (e) {
      showError(e.response?.data?.message || 'Không thể xoá phòng đang có suất chiếu. Vui lòng xoá suất chiếu trước.');
      setDeleteConfirm(null);
    }
  };

  const openSeatModal = async (r) => {
    setSeatModal(r);
    setSeatsLoading(true);
    setRoomSeats([]);
    try {
      const res = await adminApi.getRoomSeats(r.id);
      setRoomSeats(res.data.data || []);
    } catch (e) {
      showError('Không thể tải danh sách ghế');
    } finally {
      setSeatsLoading(false);
    }
  };

  const closeSeatModal = () => {
    setSeatModal(null);
    setRoomSeats([]);
  };

  const handleSeatToggle = (index) => {
    setRoomSeats(prev => {
      const newSeats = [...prev];
      const seat = newSeats[index];
      const currentType = seat.typeName || 'NORMAL';
      newSeats[index] = {
        ...seat,
        typeName: currentType === 'NORMAL' ? 'VIP' : 'NORMAL'
      };
      return newSeats;
    });
  };

  const handleSeatSave = async () => {
    if (!seatModal) return;
    setSeatSaveLoading(true);
    try {
      await adminApi.updateRoomSeats(seatModal.id, roomSeats);
      showSuccess('Đã cập nhật sơ đồ ghế');
      closeSeatModal();
    } catch (e) {
      showError(e.response?.data?.message || 'Không thể thay đổi loại ghế khi phòng đang có suất chiếu được lên lịch.');
    } finally {
      setSeatSaveLoading(false);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Quản lý Phòng chiếu <span>{rooms.length} phòng</span></h1>
        <button className="btn-admin-primary" onClick={openCreate}>
          <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14 }}>
            <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Thêm phòng
        </button>
      </div>

      {error && <div className="admin-alert admin-alert-error">{error}</div>}
      {success && <div className="admin-alert admin-alert-success">{success}</div>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên phòng</th>
              <th>Loại phòng</th>
              <th>Hàng × Cột</th>
              <th>Tổng ghế</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6}><div className="admin-loading"><div className="admin-spinner" /></div></td></tr>
            ) : rooms.length === 0 ? (
              <tr><td colSpan={6}><div className="admin-empty">Chưa có phòng chiếu nào</div></td></tr>
            ) : rooms.map(r => {
              // SỬA: Đặt biến tạm để lấy đúng loại phòng
              const currentRoomType = r.roomType || r.type;

              return (
                <tr key={r.id}>
                  <td style={{ color: 'var(--t3)', fontSize: 12 }}>#{r.id}</td>
                  <td style={{ fontWeight: 600 }}>{r.name}</td>
                  <td>
                    {/* SỬA: Hiển thị loại phòng an toàn */}
                    <span className="badge badge-customer">
                      {ROOM_TYPE_LABELS[currentRoomType] || currentRoomType || 'N/A'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--t2)' }}>{r.totalRows} × {r.totalCols}</td>

                  {/* SỬA: Tự động tính tổng ghế */}
                  <td style={{ color: 'var(--t2)' }}>
                    {r.totalRows && r.totalCols ? (r.totalRows * r.totalCols) : 0} ghế
                  </td>

                  <td>
                    <div className="admin-actions-group">
                      <button className="btn-admin-secondary" onClick={() => openEdit(r)}>Sửa</button>
                      <button className="btn-admin-primary" style={{ backgroundColor: 'var(--gold)', borderColor: 'var(--gold)', color: '#000' }} onClick={() => openSeatModal(r)}>Sơ đồ ghế</button>
                      <button className="btn-admin-danger" onClick={() => setDeleteConfirm(r)}>Xóa</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
            <button className="admin-modal-close" onClick={closeModal}>×</button>
            <h2 className="admin-modal-title">{editRoom ? 'Sửa phòng chiếu' : 'Thêm phòng chiếu mới'}</h2>
            {!editRoom && (
              <div className="admin-alert" style={{ background: 'var(--gold-dim)', color: 'var(--gold)', border: '1px solid rgba(232,160,32,0.3)', marginBottom: 16, fontSize: 12 }}>
                Sơ đồ ghế sẽ được tạo tự động dựa trên số hàng × số cột đã nhập.
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label className="admin-form-label">Tên phòng *</label>
                <input className="admin-form-input" name="name" value={form.name} onChange={handleFormChange} required />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Loại phòng</label>
                <select className="admin-form-select" name="type" value={form.type} onChange={handleFormChange}>
                  {ROOM_TYPES.map(t => <option key={t} value={t}>{ROOM_TYPE_LABELS[t]}</option>)}
                </select>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label">Số hàng *</label>
                  <input className="admin-form-input" name="totalRows" type="number" min="1" max="30" value={form.totalRows} onChange={handleFormChange} required />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Số cột *</label>
                  <input className="admin-form-input" name="totalCols" type="number" min="1" max="20" value={form.totalCols} onChange={handleFormChange} required />
                </div>
              </div>


              {form.totalRows && form.totalCols && (
                <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', marginBottom: 8, fontSize: 13, color: 'var(--t2)' }}>
                  Tổng số ghế: <strong style={{ color: 'var(--t1)' }}>{form.totalRows * form.totalCols} ghế</strong>
                </div>
              )}
              <div className="admin-modal-footer">
                <button type="button" className="btn-admin-secondary" onClick={closeModal}>Hủy</button>
                <button type="submit" className="btn-admin-primary" disabled={formLoading}>
                  {formLoading ? 'Đang lưu...' : editRoom ? 'Cập nhật' : 'Tạo phòng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="admin-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="admin-modal admin-confirm-modal" onClick={e => e.stopPropagation()}>
            <button className="admin-modal-close" onClick={() => setDeleteConfirm(null)}>×</button>
            <h2 className="admin-modal-title">Xóa phòng chiếu</h2>
            <p className="admin-confirm-text">
              Bạn có chắc muốn xóa <strong>{deleteConfirm.name}</strong> này?
              Toàn bộ ghế trong phòng cũng sẽ bị xoá.
            </p>
            <div className="admin-modal-footer">
              <button className="btn-admin-secondary" onClick={() => setDeleteConfirm(null)}>Hủy</button>
              <button className="btn-admin-danger" onClick={handleDelete}>Xóa phòng</button>
            </div>
          </div>
        </div>
      )}

      {/* Seat Management Modal */}
      {seatModal && (
        <div className="admin-modal-overlay" onClick={closeSeatModal}>
          <div className="admin-modal" style={{ maxWidth: 800, width: '90%' }} onClick={e => e.stopPropagation()}>
            <button className="admin-modal-close" onClick={closeSeatModal}>×</button>
            <h2 className="admin-modal-title">Sơ đồ ghế: {seatModal.name}</h2>

            <div className="seat-map-container" style={{ minHeight: 200, padding: 20, background: 'var(--bg2)', borderRadius: 8, overflowX: 'auto' }}>
              {seatsLoading ? (
                <div className="admin-loading"><div className="admin-spinner" /></div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', minWidth: 'max-content' }}>
                  <div style={{ width: '80%', height: 30, background: 'var(--border)', borderRadius: '20px 20px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 30, color: 'var(--t2)', fontSize: 12, fontWeight: 600 }}>MÀN HÌNH</div>

                  <div style={{ display: 'flex', gap: 16, marginBottom: 24, fontSize: 13, color: 'var(--t2)', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 16, height: 16, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 4 }} /> Ghế Thường
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 16, height: 16, background: 'var(--gold)', border: '1px solid var(--gold)', borderRadius: 4 }} /> Ghế VIP
                    </div>
                  </div>

                  {/* Group seats by row */}
                  {Object.entries(roomSeats.reduce((acc, seat, i) => {
                    if (!acc[seat.rowLetter]) acc[seat.rowLetter] = [];
                    acc[seat.rowLetter].push({ ...seat, originalIndex: i });
                    return acc;
                  }, {})).map(([row, seats]) => (
                    <div key={row} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <div style={{ width: 24, fontWeight: 600, color: 'var(--t2)' }}>{row}</div>
                      {seats.sort((a, b) => a.seatNumber - b.seatNumber).map(seat => (
                        <div
                          key={seat.id}
                          onClick={() => handleSeatToggle(seat.originalIndex)}
                          style={{
                            width: 32, height: 32,
                            borderRadius: '4px 4px 8px 8px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 11, fontWeight: 600, cursor: 'pointer',
                            userSelect: 'none',
                            background: (!seat.typeName || seat.typeName === 'NORMAL') ? 'var(--bg3)' : 'var(--gold)',
                            color: (!seat.typeName || seat.typeName === 'NORMAL') ? 'var(--t2)' : '#000',
                            border: `1px solid ${(!seat.typeName || seat.typeName === 'NORMAL') ? 'var(--border)' : 'var(--gold)'}`
                          }}
                          title={`Ghế ${row}${seat.seatNumber} - ${seat.typeName || 'NORMAL'}`}
                        >
                          {seat.seatNumber}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="admin-modal-footer" style={{ marginTop: 24 }}>
              <button type="button" className="btn-admin-secondary" onClick={closeSeatModal}>Hủy</button>
              <button type="button" className="btn-admin-primary" onClick={handleSeatSave} disabled={seatSaveLoading || seatsLoading}>
                {seatSaveLoading ? 'Đang lưu...' : 'Lưu sơ đồ ghế'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomsPage;