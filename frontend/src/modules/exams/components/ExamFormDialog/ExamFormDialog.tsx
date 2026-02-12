import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function ExamFormDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent><DialogHeader><DialogTitle>Exam Form</DialogTitle></DialogHeader><p>Form implementation coming soon...</p></DialogContent>
    </Dialog>
  )
}
