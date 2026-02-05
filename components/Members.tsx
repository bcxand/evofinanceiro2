import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Card } from './ui/Card';
import { Plus, Trash2, Edit2, Upload, Calendar, DollarSign, Mail, Phone, User, X, Check, Save, Key, Copy, Shield, Loader2 } from 'lucide-react';
import { FamilyMember } from '../types';
import { supabase } from '../lib/supabase';

export const Members: React.FC = () => {
  const { familyMembers, addFamilyMember, updateFamilyMember, removeFamilyMember } = useFinance();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [accessModalOpen, setAccessModalOpen] = useState<string | null>(null); // ID of member to show access code
  const [uploading, setUploading] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<FamilyMember>>({
      name: '',
      role: '',
      salary: 0,
      payDay: 5,
      email: '',
      color: '#3B82F6',
      avatarUrl: ''
  });

  const resetForm = () => {
      setFormData({
        name: '',
        role: '',
        salary: 0,
        payDay: 5,
        email: '',
        color: '#3B82F6',
        avatarUrl: ''
      });
      setIsAdding(false);
      setEditingId(null);
  };

  const handleEdit = (member: FamilyMember) => {
      setFormData(member);
      setEditingId(member.id);
      setIsAdding(true);
  };

  const handleSave = async () => {
      if (!formData.name) return; // Role is optional or can be anything
      
      const memberData = {
          name: formData.name,
          role: formData.role || 'Membro',
          salary: Number(formData.salary) || 0,
          payDay: Number(formData.payDay) || 5,
          email: formData.email,
          color: formData.color || '#3B82F6',
          avatarUrl: formData.avatarUrl
      };

      if (editingId) {
          await updateFamilyMember(editingId, memberData);
      } else {
          await addFamilyMember(memberData as any);
      }
      resetForm();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
        setUploading(true);
        if (!e.target.files || e.target.files.length === 0) {
            setUploading(false);
            return;
        }

        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file);

        if (uploadError) {
            throw uploadError;
        }

        // Get Public URL
        const { data } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

        setFormData(prev => ({ ...prev, avatarUrl: data.publicUrl }));
      } catch (error) {
          console.error('Error uploading image:', error);
          alert('Erro ao enviar imagem. Tente novamente.');
      } finally {
          setUploading(false);
      }
  };

  const generateAccessCode = async (member: FamilyMember) => {
      // Simulate unique 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      await updateFamilyMember(member.id, { accessCode: code, isAccessActive: true });
      setAccessModalOpen(member.id);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Membros</h2>
          <p className="text-sm text-gray-500">Adicione pessoas que compartilham o orçamento.</p>
        </div>
        {!isAdding && (
            <button 
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold shadow-md hover:bg-blue-700 transition-colors"
            >
                <Plus size={18} />
                Adicionar Membro
            </button>
        )}
      </div>

      {/* ACCESS CODE MODAL */}
      {accessModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
              <Card className="w-full max-w-sm bg-white p-6 text-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                      <Key size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Acesso Gerado!</h3>
                  <p className="text-sm text-gray-500 mb-6">
                      Compartilhe este código com o membro. Ele poderá acessar este painel com permissões limitadas.
                  </p>
                  
                  <div className="bg-slate-100 p-4 rounded-xl mb-6 flex justify-between items-center border border-slate-200">
                      <span className="text-2xl font-mono font-bold text-slate-900 tracking-widest">
                          {familyMembers.find(m => m.id === accessModalOpen)?.accessCode}
                      </span>
                      <button 
                        onClick={() => {
                            navigator.clipboard.writeText(familyMembers.find(m => m.id === accessModalOpen)?.accessCode || '');
                            alert('Código copiado!');
                        }}
                        className="p-2 hover:bg-white rounded-lg text-slate-500 transition-colors"
                       >
                          <Copy size={18} />
                      </button>
                  </div>

                  <button 
                    onClick={() => setAccessModalOpen(null)}
                    className="w-full py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-black"
                  >
                      Fechar
                  </button>
              </Card>
          </div>
      )}

      {isAdding && (
          <Card className="border-2 border-blue-100 shadow-lg">
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                  <h3 className="text-lg font-bold text-gray-900">{editingId ? 'Editar Membro' : 'Novo Membro'}</h3>
                  <button onClick={resetForm} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Photo Upload */}
                  <div className="col-span-12 md:col-span-3 flex flex-col items-center gap-4">
                      <div className="relative w-32 h-32 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden group">
                          {uploading ? (
                              <Loader2 className="animate-spin text-blue-600" size={32} />
                          ) : formData.avatarUrl ? (
                              <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                              <User size={40} className="text-gray-300" />
                          )}
                          
                          <label className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity cursor-pointer ${uploading ? 'hidden' : 'opacity-0 group-hover:opacity-100'}`}>
                              <Upload className="text-white" size={24} />
                              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                          </label>
                      </div>
                      <p className="text-xs text-gray-500">
                          {uploading ? 'Enviando...' : 'Clique para alterar foto'}
                      </p>
                  </div>

                  {/* Fields */}
                  <div className="col-span-12 md:col-span-9 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                              <input 
                                type="text" 
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Ex: Ricardo Silva"
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição / Parentesco (Opcional)</label>
                              <input 
                                type="text"
                                value={formData.role}
                                onChange={e => setFormData({...formData, role: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Ex: Primo, Tio, Eu, Esposa..."
                              />
                          </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Salário Mensal (R$)</label>
                              <div className="relative">
                                  <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                  <input 
                                    type="number" 
                                    value={formData.salary}
                                    onChange={e => setFormData({...formData, salary: parseFloat(e.target.value)})}
                                    className="w-full pl-9 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-900"
                                  />
                              </div>
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Dia do Pagamento</label>
                              <div className="relative">
                                  <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                  <input 
                                    type="number" 
                                    min="1" max="31"
                                    value={formData.payDay}
                                    onChange={e => setFormData({...formData, payDay: parseInt(e.target.value)})}
                                    className="w-full pl-9 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Dia 5"
                                  />
                              </div>
                          </div>
                          <div>
                               <label className="block text-sm font-medium text-gray-700 mb-1">Email (Contato)</label>
                               <div className="relative">
                                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                  <input 
                                    type="email" 
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                    className="w-full pl-9 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="contato@email.com"
                                  />
                              </div>
                          </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-4">
                          <button onClick={resetForm} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg">Cancelar</button>
                          <button 
                            onClick={handleSave}
                            disabled={uploading}
                            className={`px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 shadow-md flex items-center gap-2 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                              <Save size={18} />
                              {uploading ? 'Enviando foto...' : 'Salvar Membro'}
                          </button>
                      </div>
                  </div>
              </div>
          </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {familyMembers.map(member => (
              <Card key={member.id} className="relative group overflow-hidden hover:shadow-lg transition-all border-t-4" style={{ borderTopColor: member.color }}>
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(member)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Edit2 size={16}/></button>
                      <button onClick={() => removeFamilyMember(member.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><Trash2 size={16}/></button>
                  </div>
                  
                  <div className="flex flex-col items-center pt-4 pb-6">
                      <div className="w-20 h-20 rounded-full border-4 border-white shadow-md mb-3 overflow-hidden bg-gray-100 flex items-center justify-center">
                          {member.avatarUrl ? (
                              <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                          ) : (
                              <span className="text-2xl font-bold text-gray-400">{member.name.charAt(0)}</span>
                          )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                      <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full mt-1">{member.role}</span>
                  </div>

                  <div className="border-t border-gray-100 pt-4 space-y-3">
                      <div className="flex justify-between items-center px-4">
                          <div className="flex items-center gap-2 text-gray-600">
                              <DollarSign size={16} className="text-emerald-500" />
                              <span className="text-sm">Salário</span>
                          </div>
                          <span className="font-bold text-gray-900">R$ {member.salary.toLocaleString('pt-BR')}</span>
                      </div>
                      
                      {/* Access Code Generation */}
                      <div className="px-4 pt-2">
                          {member.accessCode ? (
                              <button 
                                onClick={() => setAccessModalOpen(member.id)}
                                className="w-full py-2 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100 flex items-center justify-center gap-2 hover:bg-emerald-100"
                              >
                                  <Key size={14} /> Ver Acesso (Ativo)
                              </button>
                          ) : (
                              <button 
                                onClick={() => generateAccessCode(member)}
                                className="w-full py-2 bg-gray-50 text-gray-600 text-xs font-bold rounded-lg border border-gray-200 flex items-center justify-center gap-2 hover:bg-gray-100"
                              >
                                  <Shield size={14} /> Criar Acesso Individual
                              </button>
                          )}
                      </div>
                  </div>
              </Card>
          ))}
      </div>
    </div>
  );
};