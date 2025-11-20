import { 
  Package, 
  Laptop, 
  Home, 
  Wrench, 
  Sofa, 
  MoreHorizontal,
  Wind,
  Droplets,
  Zap,
  TreePine,
  Settings,
  Car,
  CreditCard,
  FileText,
  Award,
  Calendar
} from 'lucide-react'

interface CategoryIconProps {
  category: string
  type: 'item' | 'task' | 'document'
  className?: string
}

const itemIcons: Record<string, any> = {
  'APPLIANCE': Home,
  'ELECTRONICS': Laptop,
  'HOME_GOODS': Package,
  'TOOLS': Wrench,
  'FURNITURE': Sofa,
  'OTHER': MoreHorizontal,
}

const taskIcons: Record<string, any> = {
  'HVAC': Wind,
  'PLUMBING': Droplets,
  'ELECTRICAL': Zap,
  'YARD': TreePine,
  'GENERAL': Settings,
  'CUSTOM': Wrench,
}

const documentIcons: Record<string, any> = {
  'DRIVERS_LICENSE': Car,
  'PASSPORT': FileText,
  'CAR_REGISTRATION': Car,
  'INSURANCE': CreditCard,
  'PROFESSIONAL_LICENSE': Award,
  'SUBSCRIPTION': Calendar,
  'OTHER': FileText,
}

export default function CategoryIcon({ category, type, className = 'h-5 w-5' }: CategoryIconProps) {
  let IconComponent

  switch (type) {
    case 'item':
      IconComponent = itemIcons[category] || Package
      break
    case 'task':
      IconComponent = taskIcons[category] || Settings
      break
    case 'document':
      IconComponent = documentIcons[category] || FileText
      break
    default:
      IconComponent = MoreHorizontal
  }

  return <IconComponent className={className} />
}


