"use client";

import { useState } from "react";
import {
  useSportsAdmin,
  useCreateSport,
  useUpdateSport,
  useDeleteSport,
} from "@/hooks/use-api";
import { AdminLayout } from "@/components/layout/admin-layout";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, Edit2, Plus } from "lucide-react";
import { toast } from "sonner";

export default function SportsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteSport, setDeleteSport] = useState<any | null>(null);
  const [editingSport, setEditingSport] = useState<any | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    image: null as File | null,
  });

  const { data, isLoading } = useSportsAdmin(searchQuery || undefined);
  const createSport = useCreateSport();
  const updateSport = useUpdateSport();
  const removeSport = useDeleteSport();

  const resetForm = () => setFormState({ name: "", image: null });

  const openCreate = () => {
    resetForm();
    setEditingSport(null);
    setIsCreateOpen(true);
  };

  const openEdit = (sport: any) => {
    setEditingSport(sport);
    setFormState({ name: sport.name || "", image: null });
    setIsCreateOpen(true);
  };

  const submitSport = () => {
    if (!formState.name) {
      toast.error("Please enter a sport name");
      return;
    }
    const formData = new FormData();
    formData.append("name", formState.name);
    if (formState.image) formData.append("image", formState.image);

    if (editingSport) {
      updateSport.mutate({ id: editingSport._id, data: formData });
    } else {
      createSport.mutate(formData);
    }
    setIsCreateOpen(false);
    setEditingSport(null);
    resetForm();
  };

  const sports = data?.sports || [];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Sport Management</h1>
            <p className="text-slate-400 mt-1">
              Manage the sports shown in the player app
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={openCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Add Sport
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-4 border-slate-700 bg-slate-900">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Search by sport name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700 text-white"
            />
          </div>
        </Card>

        {/* Table */}
        {isLoading ? (
          <TableSkeleton columns={3} rows={10} />
        ) : sports.length > 0 ? (
          <Card className="border-slate-700 bg-slate-900 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-800 border-slate-700">
                    <TableHead className="text-slate-300">Sport</TableHead>
                    <TableHead className="text-slate-300">Added</TableHead>
                    <TableHead className="text-right text-slate-300">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sports.map((sport: any) => (
                    <TableRow key={sport._id} className="border-slate-700">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md overflow-hidden bg-slate-800 shrink-0">
                            {sport.image?.url ? (
                              <img
                                src={sport.image.url}
                                alt={sport.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-500 text-[10px]">
                                N/A
                              </div>
                            )}
                          </div>
                          <p className="font-medium text-white">{sport.name}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {new Date(sport.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-blue-400"
                            onClick={() => openEdit(sport)}
                          >
                            <Edit2 className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-600 text-red-400 hover:bg-red-600/10 bg-transparent"
                            onClick={() => setDeleteSport(sport)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        ) : (
          <Card className="p-12 border-slate-700 bg-slate-900 text-center">
            <p className="text-slate-400">No sports found</p>
          </Card>
        )}
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingSport ? "Update Sport" : "Add Sport"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4">
            <Input
              placeholder="Sport name"
              value={formState.name}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              className="bg-slate-800 border-slate-700 text-white"
            />
            <Input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormState({ ...formState, image: e.target.files?.[0] || null })
              }
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              className="border-slate-700 bg-transparent"
              onClick={() => setIsCreateOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={submitSport}
              disabled={createSport.isPending || updateSport.isPending}
            >
              {editingSport ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteSport}
        onOpenChange={(open) => !open && setDeleteSport(null)}
      >
        <AlertDialogContent className="bg-slate-900 border-slate-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete sport?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              This may affect pitches or events that reference it. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 border-slate-700 text-white">
              No
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (!deleteSport) return;
                removeSport.mutate(deleteSport._id);
                setDeleteSport(null);
              }}
            >
              Yes, delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
