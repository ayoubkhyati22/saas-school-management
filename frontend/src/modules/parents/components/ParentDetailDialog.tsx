import { useQuery } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { parentService } from '../api/parent.service'
import { formatDate } from '@/lib/utils'
import { Mail, Phone, MapPin, Briefcase, User, Clock, Users, Heart } from 'lucide-react'

interface ParentDetailDialogProps {
  open: boolean
  onClose: () => void
  parentId: string
}

export default function ParentDetailDialog({ open, onClose, parentId }: ParentDetailDialogProps) {
  const { data: parent, isLoading } = useQuery({
    queryKey: ['parents', parentId],
    queryFn: () => parentService.getById(parentId),
    enabled: open && !!parentId,
  })

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-black dark:text-white">
        <DialogHeader>
          <DialogTitle className="text-black dark:text-white">Parent Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : parent ? (
          <div className="space-y-6">
            {/* Header with Avatar and Basic Info */}
            <div className="flex items-center gap-4 pb-4 border-b">
              <div className="h-20 w-20 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-2xl font-bold border-2 border-purple-200">
                {parent.firstName[0]}
                {parent.lastName[0]}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">
                  {parent.firstName} {parent.lastName}
                </h2>
                {parent.occupation && (
                  <Badge variant="secondary" className="mt-1">
                    {parent.occupation}
                  </Badge>
                )}
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Left Column */}
              <div className="space-y-4">
                
                {/* Contact Information */}
                <Card className="border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-800">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="flex-1 break-all">{parent.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="flex-1">{parent.phoneNumber}</span>
                      </div>
                      {parent.address && (
                        <div className="flex items-center gap-3 text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="flex-1">{parent.address}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Professional Information */}
                {parent.occupation && (
                  <Card className="border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-800">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-primary" />
                        Professional Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <div className="flex items-center gap-3 text-muted-foreground">
                            <Briefcase className="h-4 w-4 flex-shrink-0" />
                            <span>Occupation</span>
                          </div>
                          <span className="font-medium">{parent.occupation}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* System Information */}
                <Card className="border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-800">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      System Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <span className="text-muted-foreground">Created At</span>
                        <span className="font-medium">{formatDate(parent.createdAt)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <span className="text-muted-foreground">Last Updated</span>
                        <span className="font-medium">{formatDate(parent.updatedAt)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div>

              {/* Right Column */}
              <div className="space-y-4">
                
                {/* Children Information */}
                <Card className="border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-800">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      Children ({parent.children?.length || 0})
                    </h3>
                    <div className="space-y-3">
                      {parent.children && parent.children.length > 0 ? (
                        parent.children.map((child) => (
                          <div
                            key={child.id}
                            className="p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 hover:border-primary transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3 flex-1">
                                <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold">
                                  {child.studentFirstName?.[0]}
                                  {child.studentLastName?.[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium">
                                    {child.studentFirstName} {child.studentLastName}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {child.studentRegistrationNumber}
                                  </div>
                                  {child.classRoomName && (
                                    <div className="text-xs text-muted-foreground mt-1">
                                      Class: {child.classRoomName}
                                    </div>
                                  )}
                                </div>
                              </div>
                              {child.isPrimaryContact && (
                                <Badge variant="default" className="ml-2">
                                  <Heart className="h-3 w-3 mr-1" />
                                  Primary
                                </Badge>
                              )}
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {child.relationshipType}
                              </Badge>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 text-muted-foreground">
                          <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No children linked</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

              </div>

            </div>
          </div>
        ) : (
          <div className="text-center py-8">Parent not found</div>
        )}
      </DialogContent>
    </Dialog>
  )
}
