// Equipment Management Types

export enum EquipmentStatus {
  running = "running",
  stopped = "stopped",
  fault = "fault",
  disabled = "disabled",
}

export interface Equipment {
  id: string;
  equipmentNo: string;
  equipmentName: string;
  categoryName: string;
  workshopName: string;
  location: string;
  model: string;
  manufacturer: string;
  commissionDate: string;
  purchasePrice: number;
  status: EquipmentStatus;
  oee: number;
  nextMaintenanceDate: string;
}

export interface EquipmentFilter {
  equipmentNo?: string;
  equipmentName?: string;
  categoryId?: string;
  workshopId?: string;
  status?: EquipmentStatus;
}

export interface EquipmentFormData {
  equipmentNo?: string;
  equipmentName: string;
  categoryName: string;
  workshopName: string;
  location: string;
  model: string;
  manufacturer: string;
  commissionDate: string;
  purchasePrice: number;
  status: EquipmentStatus;
}

// Dictionary types
export interface EquipmentCategory {
  value: string;
  label: string;
}

export interface Workshop {
  value: string;
  label: string;
}

export interface EquipmentStatusOption {
  value: EquipmentStatus;
  label: string;
  color: string;
}
