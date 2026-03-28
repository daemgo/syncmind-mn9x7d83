// Maintenance Work Order Type Definitions

/**
 * Work Order Status Enumeration
 */
export type WorkOrderStatus =
  | "pending"       // 待派工
  | "assigned"      // 待执行
  | "processing"    // 执行中
  | "verifying"     // 待验收
  | "completed"     // 已完成
  | "cancelled";    // 已取消

/**
 * Priority Level Enumeration
 */
export type Priority =
  | "high"          // 高
  | "medium"        // 中
  | "low";          // 低

/**
 * Work Order Main Interface
 */
export interface WorkOrder {
  // Basic Information
  id: string;                      // Unique identifier
  workOrderNo: string;             // Work order number (e.g., WO26030001)
  equipmentId: string;             // Equipment ID
  equipmentName: string;           // Equipment name
  equipmentCode?: string;          // Equipment code

  // Classification
  priority: Priority;              // Emergency level
  status: WorkOrderStatus;         // Current status
  category?: string;               // Work order category (preventive, corrective, etc.)

  // Assignment
  assigneeId?: string;             // Assignee user ID
  assigneeName?: string;           // Assignee name
  department?: string;             // Responsible department

  // Time Tracking
  createTime: string;              // Creation timestamp
  updateTime?: string;             // Last update timestamp
  assignTime?: string;             // Assignment timestamp
  startTime?: string;              // Start timestamp
  completeTime?: string;           // Completion timestamp
  expectCompleteTime?: string;     // Expected completion time

  // Details
  title: string;                   // Work order title
  description: string;             // Problem description
  symptoms?: string;               // Fault symptoms
  cause?: string;                  // Root cause analysis
  solution?: string;               // Solution description

  // Location
  location?: string;               // Equipment location
  building?: string;               // Building name
  floor?: string;                  // Floor number

  // Attachments
  attachments?: string[];          // Attachment URLs

  // Verification
  verificationResult?: string;     // Verification result
  verifiedBy?: string;             // Verifier name
  verifiedAt?: string;             // Verification timestamp

  // Metadata
  createdBy?: string;              // Creator name
  updatedBy?: string;              // Last updater name
  tags?: string[];                 // Tags for categorization
  notes?: string;                  // Additional notes
}

/**
 * Work Order List Item (for table display)
 */
export interface WorkOrderListItem {
  id: string;
  workOrderNo: string;
  equipmentName: string;
  priority: Priority;
  status: WorkOrderStatus;
  assigneeName?: string;
  createTime: string;
  expectCompleteTime?: string;
}

/**
 * Work Order Form Data
 */
export interface WorkOrderFormData {
  equipmentId?: string;
  equipmentName?: string;
  priority: Priority;
  category?: string;
  assigneeId?: string;
  assigneeName?: string;
  department?: string;
  expectCompleteTime?: string;
  title: string;
  description: string;
  symptoms?: string;
  location?: string;
  building?: string;
  floor?: string;
  tags?: string[];
  notes?: string;
}

/**
 * Work Order Filter Options
 */
export interface WorkOrderFilters {
  workOrderNo?: string;            // Filter by work order number
  status?: WorkOrderStatus;        // Filter by status
  priority?: Priority;             // Filter by priority
  assigneeId?: string;             // Filter by assignee
  department?: string;             // Filter by department
  dateFrom?: string;               // Filter by date range start
  dateTo?: string;                 // Filter by date range end
  equipmentId?: string;            // Filter by equipment
}

/**
 * Status Dictionary Entry
 */
export interface WorkOrderStatusDict {
  value: WorkOrderStatus;
  label: string;
  color: string;
  variant: "default" | "secondary" | "destructive" | "outline";
}

/**
 * Priority Dictionary Entry
 */
export interface PriorityDict {
  value: Priority;
  label: string;
  color: string;
  variant: "default" | "secondary" | "destructive" | "outline";
}
