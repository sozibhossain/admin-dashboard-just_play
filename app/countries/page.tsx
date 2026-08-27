"use client";

import { useState } from "react";
import {
  useCountries,
  useCreateCountry,
  useUpdateCountry,
  useDeleteCountry,
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

export default function CountriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteCountry, setDeleteCountry] = useState<any | null>(null);
  const [editingCountry, setEditingCountry] = useState<any | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    image: null as File | null,
  });

  const { data, isLoading } = useCountries(searchQuery || undefined);
  const createCountry = useCreateCountry();
  const updateCountry = useUpdateCountry();
  const removeCountry = useDeleteCountry();

  const resetForm = () => setFormState({ name: "", image: null });

  const openCreate = () => {
    resetForm();
    setEditingCountry(null);
    setIsCreateOpen(true);
  };

  const openEdit = (country: any) => {
    setEditingCountry(country);
    setFormState({ name: country.name || "", image: null });
    setIsCreateOpen(true);
  };

  const submitCountry = () => {
    if (!formState.name) {
      toast.error("Please enter a country name");
      return;
    }
    const formData = new FormData();
    formData.append("name", formState.name);
    if (formState.image) formData.append("image", formState.image);

    if (editingCountry) {
      updateCountry.mutate({ id: editingCountry._id, data: formData });
    } else {
      createCountry.mutate(formData);
    }
    setIsCreateOpen(false);
    setEditingCountry(null);
    resetForm();
  };

  const countries = data?.countries || [];

  return (
    <AdminLayout>
      <div className="space-y-5 p-4 sm:space-y-6 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Country Management</h1>
            <p className="text-slate-400 mt-1">
              Manage the countries/cities shown in the player app
            </p>
          </div>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 sm:w-auto" onClick={openCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Add Country
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-4 border-slate-700 bg-slate-900">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Search by country name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700 text-white"
            />
          </div>
        </Card>

        {/* Table */}
        {isLoading ? (
          <TableSkeleton columns={3} rows={10} />
        ) : countries.length > 0 ? (
          <Card className="border-slate-700 bg-slate-900 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-800 border-slate-700">
                    <TableHead className="text-slate-300">Country</TableHead>
                    <TableHead className="text-slate-300">Added</TableHead>
                    <TableHead className="text-right text-slate-300">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {countries.map((country: any) => (
                    <TableRow key={country._id} className="border-slate-700">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md overflow-hidden bg-slate-800 shrink-0">
                            {country.image?.url ? (
                              <img
                                src={country.image.url}
                                alt={country.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-500 text-[10px]">
                                N/A
                              </div>
                            )}
                          </div>
                          <p className="font-medium text-white">{country.name}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {new Date(country.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-blue-400"
                            onClick={() => openEdit(country)}
                          >
                            <Edit2 className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-600 text-red-400 hover:bg-red-600/10 bg-transparent"
                            onClick={() => setDeleteCountry(country)}
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
            <p className="text-slate-400">No countries found</p>
          </Card>
        )}
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCountry ? "Update Country" : "Add Country"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4">
            <Input
              placeholder="Country name"
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
              onClick={submitCountry}
              disabled={createCountry.isPending || updateCountry.isPending}
            >
              {editingCountry ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteCountry}
        onOpenChange={(open) => !open && setDeleteCountry(null)}
      >
        <AlertDialogContent className="bg-slate-900 border-slate-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete country?</AlertDialogTitle>
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
                if (!deleteCountry) return;
                removeCountry.mutate(deleteCountry._id);
                setDeleteCountry(null);
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
