import { create } from 'zustand';
import { Dataset, DatasetPreview, DatasetSchema } from '@/types';
import { apiClient } from '@/lib/api';

interface DatasetState {
  datasets: Dataset[];
  currentDataset: Dataset | null;
  preview: DatasetPreview | null;
  schema: DatasetSchema | null;
  isLoading: boolean;
  isUploading: boolean;
  error: string | null;
  uploadProgress: number;

  // Actions
  fetchDatasets: () => Promise<void>;
  uploadDataset: (file: File, name: string, description?: string) => Promise<Dataset>;
  selectDataset: (dataset: Dataset) => void;
  updateDataset: (id: string, data: { name?: string; description?: string }) => Promise<void>;
  deleteDataset: (id: string) => Promise<void>;
  setError: (error: string | null) => void;
  clearError: () => void;
  setUploadProgress: (progress: number) => void;
}

export const useDatasetStore = create<DatasetState>()((set, get) => ({
  datasets: [],
  currentDataset: null,
  preview: null,
  schema: null,
  isLoading: false,
  isUploading: false,
  error: null,
  uploadProgress: 0,

  fetchDatasets: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const datasets = await apiClient.getDatasets();
      set({
        datasets,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.detail || 'Failed to fetch datasets',
      });
    }
  },

  uploadDataset: async (file: File, name: string, description?: string) => {
    set({ isUploading: true, error: null, uploadProgress: 0 });
    
    try {
      // TODO: Add progress tracking
      const dataset = await apiClient.uploadDataset(file, name, description);
      
      // Add to datasets list
      const currentDatasets = get().datasets;
      set({
        datasets: [dataset, ...currentDatasets],
        isUploading: false,
        uploadProgress: 100,
      });
      
      return dataset;
    } catch (error: any) {
      set({
        isUploading: false,
        uploadProgress: 0,
        error: error.response?.data?.detail || 'Upload failed',
      });
      throw error;
    }
  },

  selectDataset: (dataset: Dataset) => {
    set({ currentDataset: dataset });
  },

  updateDataset: async (id: string, data: { name?: string; description?: string }) => {
    set({ isLoading: true, error: null });
    
    try {
      const updatedDataset = await apiClient.updateDataset(id, data);
      
      // Update datasets list
      const datasets = get().datasets.map(d => 
        d.id === id ? updatedDataset : d
      );
      
      set({
        datasets,
        currentDataset: get().currentDataset?.id === id ? updatedDataset : get().currentDataset,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.detail || 'Update failed',
      });
      throw error;
    }
  },

  deleteDataset: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      await apiClient.deleteDataset(id);
      
      // Remove from datasets list
      const datasets = get().datasets.filter(d => d.id !== id);
      
      set({
        datasets,
        currentDataset: get().currentDataset?.id === id ? null : get().currentDataset,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.detail || 'Delete failed',
      });
      throw error;
    }
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },

  setUploadProgress: (progress: number) => {
    set({ uploadProgress: progress });
  },
}));