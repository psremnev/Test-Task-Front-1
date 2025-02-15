import type { IOrganization } from '@/types/IOrganization'
import organizations from '@/data/organizations'

export default function (): IOrganization[] {
  return organizations
}
