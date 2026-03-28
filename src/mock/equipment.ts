import { Equipment, EquipmentStatus } from "@/types/equipment";

// Dictionary data
export const equipmentCategories = [
  { value: "cnc", label: "数控机床" },
  { value: "milling", label: "铣床" },
  { value: "lathe", label: "车床" },
  { value: "grinding", label: "磨床" },
  { value: "other", label: "其他" },
];

export const workshops = [
  { value: "ws1", label: "一车间" },
  { value: "ws2", label: "二车间" },
  { value: "ws3", label: "三车间" },
];

export const equipmentStatusOptions = [
  { value: EquipmentStatus.running, label: "运行中", color: "green" },
  { value: EquipmentStatus.stopped, label: "停机", color: "gray" },
  { value: EquipmentStatus.fault, label: "故障", color: "red" },
  { value: EquipmentStatus.disabled, label: "停用", color: "default" },
];

// Helper function to generate equipment number
function generateEquipmentNo(index: number): string {
  return `EQ2603${String(index + 1).padStart(3, "0")}`;
}

// Helper function to generate date relative to today
function addDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

// Helper function to get random item from array
function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Mock equipment data
export const mockEquipment: Equipment[] = Array.from({ length: 20 }, (_, i) => {
  const status = randomChoice<EquipmentStatus>([
    EquipmentStatus.running,
    EquipmentStatus.running,
    EquipmentStatus.running,
    EquipmentStatus.running,
    EquipmentStatus.stopped,
    EquipmentStatus.stopped,
    EquipmentStatus.fault,
    EquipmentStatus.disabled,
  ]);

  const category = randomChoice(equipmentCategories);
  const workshop = randomChoice(workshops);

  return {
    id: `eq-${i + 1}`,
    equipmentNo: generateEquipmentNo(i),
    equipmentName: `${category.label}-${String(i + 1).padStart(2, "0")}`,
    categoryName: category.label,
    workshopName: workshop.label,
    location: `${workshop.label}-${String(Math.floor(Math.random() * 5) + 1)}号位`,
    model: `${category.value.toUpperCase()}-${String(Math.floor(Math.random() * 900) + 100)}`,
    manufacturer: randomChoice([
      "西门子",
      "发那科",
      "三菱",
      "大族激光",
      "华工激光",
      "海天精工",
    ]),
    commissionDate: addDays(-Math.floor(Math.random() * 1000) - 100),
    purchasePrice: Math.floor(Math.random() * 800000) + 200000,
    status,
    oee: status === EquipmentStatus.running ? Math.floor(Math.random() * 35) + 60 : 0,
    nextMaintenanceDate: addDays(Math.floor(Math.random() * 30) + 5),
  };
});

export default mockEquipment;
