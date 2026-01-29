"use client";

import { useState } from "react";
import {
  usePitches,
  useUpdatePitchStatus,
  useCreatePitch,
  useUpdatePitch,
  useDeletePitch,
  useCities,
  useSports,
  usePitchOwners,
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
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Edit2, AlertCircle, Plus } from "lucide-react";
import { toast } from "sonner";

const statusColors: Record<string, { bg: string; text: string }> = {
  active: { bg: "bg-green-500/20", text: "text-green-400" },
  maintenance: { bg: "bg-yellow-500/20", text: "text-yellow-400" },
  inactive: { bg: "bg-gray-500/20", text: "text-gray-400" },
  blocked: { bg: "bg-red-500/20", text: "text-red-400" },
};

const pitchTypeStyles: Record<string, string> = {
  indoor: "bg-blue-500/20 text-blue-400",
  outdoor: "bg-green-500/20 text-green-400",
};

export default function PitchesPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewPitch, setViewPitch] = useState<any | null>(null);
  const [deletePitch, setDeletePitch] = useState<any | null>(null);
  const [editingPitch, setEditingPitch] = useState<any | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    cityId: "",
    sportId: "",
    ownerId: "",
    location: "",
    price: "",
    currency: "IQD",
    pitchType: "indoor",
    status: "active",
    image: null as File | null,
  });

  const filters = statusFilter !== "all" ? { status: statusFilter } : undefined;
  const { data, isLoading } = usePitches(page, limit, filters);
  const updateStatus = useUpdatePitchStatus();
  const createPitch = useCreatePitch();
  const updatePitch = useUpdatePitch();
  const removePitch = useDeletePitch();
  const { data: citiesData } = useCities();
  const { data: sportsData } = useSports();
  const { data: ownersData } = usePitchOwners(1, 100);

  const handleStatusChange = (pitchId: string, newStatus: string) => {
    updateStatus.mutate({ id: pitchId, status: newStatus });
  };

  const resetForm = () => {
    setFormState({
      name: "",
      cityId: "",
      sportId: "",
      ownerId: "",
      location: "",
      price: "",
      currency: "IQD",
      pitchType: "indoor",
      status: "active",
      image: null,
    });
  };

  const openCreate = () => {
    resetForm();
    setEditingPitch(null);
    setIsCreateOpen(true);
  };

  const openEdit = (pitch: any) => {
    setEditingPitch(pitch);
    setFormState({
      name: pitch.name || "",
      cityId: pitch.city?._id || "",
      sportId: pitch.sport?._id || "",
      ownerId: pitch.owner?._id || "",
      location: pitch.location || "",
      price: pitch.price?.toString() || "",
      currency: pitch.currency || "IQD",
      pitchType: pitch.pitchType || "indoor",
      status: pitch.status || "active",
      image: null,
    });
    setIsCreateOpen(true);
  };

  const submitPitch = () => {
    if (!formState.name || !formState.cityId || !formState.sportId || !formState.location || !formState.price) {
      toast.error("Please fill all required fields");
      return;
    }
    const formData = new FormData();
    formData.append("name", formState.name);
    formData.append("cityId", formState.cityId);
    formData.append("sportId", formState.sportId);
    formData.append("location", formState.location);
    formData.append("price", formState.price);
    formData.append("currency", formState.currency);
    formData.append("pitchType", formState.pitchType);
    formData.append("status", formState.status);
    if (formState.ownerId) formData.append("ownerId", formState.ownerId);
    if (formState.image) formData.append("image", formState.image);

    if (editingPitch) {
      updatePitch.mutate({ id: editingPitch._id, data: formData });
    } else {
      createPitch.mutate(formData);
    }
    setIsCreateOpen(false);
    setEditingPitch(null);
    resetForm();
  };

  const totalPages = data?.totalPages || 1;
  const cities = citiesData?.cities || [];
  const sports = sportsData?.sports || [];
  const owners = ownersData?.owners || [];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Pitch Management</h1>
            <p className="text-slate-400 mt-1">Manage all sports pitches and facilities</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={openCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Add Pitch
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-4 border-slate-700 bg-slate-900">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Search by name, city or owner..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="pl-10 bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="border-slate-700 text-slate-300 bg-transparent"
            >
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </Card>

        {/* Table */}
        {isLoading ? (
          <TableSkeleton columns={7} rows={10} />
        ) : data?.pitches && data.pitches.length > 0 ? (
          <Card className="border-slate-700 bg-slate-900 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-800 border-slate-700">
                    <TableHead className="text-slate-300">Pitch Details</TableHead>
                    <TableHead className="text-slate-300">Owner</TableHead>
                    <TableHead className="text-slate-300">Location</TableHead>
                    <TableHead className="text-slate-300">Price / Hr</TableHead>
                    <TableHead className="text-slate-300">Type</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-right text-slate-300">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.pitches.map((pitch: any) => {
                    const colors =
                      statusColors[pitch.status] || statusColors.active;
                    return (
                      <TableRow key={pitch._id} className="border-slate-700">
                        <TableCell>
                          <div>
                            <p className="font-medium text-white">
                              {pitch.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {pitch.sport?.name || "N/A"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {pitch.owner?.name || "N/A"}
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {pitch.city?.name || "N/A"}
                        </TableCell>
                        <TableCell className="font-medium text-white">
                          {pitch.price?.toLocaleString()} {pitch.currency}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`border-0 ${
                              pitchTypeStyles[pitch.pitchType] ||
                              "bg-gray-500/20 text-gray-400"
                            }`}
                          >
                            {pitch.pitchType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`border-0 ${colors.bg} ${colors.text}`}
                          >
                            {pitch.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {pitch.status === "active" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-yellow-600 text-yellow-400 hover:bg-yellow-600/10 bg-transparent"
                                onClick={() =>
                                  handleStatusChange(
                                    pitch._id,
                                    "maintenance"
                                  )
                                }
                              >
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Set Maintenance
                              </Button>
                            )}
                            {pitch.status === "maintenance" && (
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() =>
                                  handleStatusChange(pitch._id, "active")
                                }
                              >
                                Activate
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-blue-400"
                              onClick={() => openEdit(pitch)}
                            >
                              <Edit2 className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-blue-400"
                              onClick={() => setViewPitch(pitch)}
                            >
                              View Details
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-600 text-red-400 hover:bg-red-600/10 bg-transparent"
                              onClick={() => setDeletePitch(pitch)}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        ) : (
          <Card className="p-12 border-slate-700 bg-slate-900 text-center">
            <p className="text-slate-400">No pitches found</p>
          </Card>
        )}

        {/* Pagination */}
        {data?.pitches && data.pitches.length > 0 && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Page {page} of {totalPages} ({data?.total} total pitches)
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-slate-700 bg-transparent text-white"
                disabled={page === 1}
                onClick={() => setPage(Math.max(1, page - 1))}
              >
                Previous
              </Button>
              <div className="flex items-center px-4 py-2 text-sm text-slate-300">
                {page} / {totalPages}
              </div>
              <Button
                variant="outline"
                className="border-slate-700 bg-transparent text-white"
                disabled={page >= totalPages}
                onClick={() => setPage(Math.min(totalPages, page + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingPitch ? "Update Pitch" : "Add Pitch"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Pitch name"
              value={formState.name}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              className="bg-slate-800 border-slate-700 text-white"
            />
            <Select
              value={formState.cityId}
              onValueChange={(value) => setFormState({ ...formState, cityId: value })}
            >
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {cities.map((city: any) => (
                  <SelectItem key={city._id} value={city._id}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={formState.sportId}
              onValueChange={(value) => setFormState({ ...formState, sportId: value })}
            >
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Select Sport" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {sports.map((sport: any) => (
                  <SelectItem key={sport._id} value={sport._id}>
                    {sport.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={formState.ownerId || "none"}
              onValueChange={(value) =>
                setFormState({ ...formState, ownerId: value === "none" ? "" : value })
              }
            >
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Select Owner (optional)" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="none">None</SelectItem>
                {owners.map((owner: any) => (
                  <SelectItem key={owner._id} value={owner._id}>
                    {owner.businessName || owner.name || owner.phone || owner._id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Location"
              value={formState.location}
              onChange={(e) => setFormState({ ...formState, location: e.target.value })}
              className="bg-slate-800 border-slate-700 text-white"
            />
            <Input
              placeholder="Price"
              value={formState.price}
              onChange={(e) => setFormState({ ...formState, price: e.target.value })}
              className="bg-slate-800 border-slate-700 text-white"
            />
            <Input
              placeholder="Currency"
              value={formState.currency}
              onChange={(e) => setFormState({ ...formState, currency: e.target.value })}
              className="bg-slate-800 border-slate-700 text-white"
            />
            <Select
              value={formState.pitchType}
              onValueChange={(value) => setFormState({ ...formState, pitchType: value })}
            >
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Pitch Type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="indoor">Indoor</SelectItem>
                <SelectItem value="outdoor">Outdoor</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={formState.status}
              onValueChange={(value) => setFormState({ ...formState, status: value })}
            >
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="file"
              onChange={(e) =>
                setFormState({ ...formState, image: e.target.files?.[0] || null })
              }
              className="bg-slate-800 border-slate-700 text-white md:col-span-2"
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
              onClick={submitPitch}
              disabled={createPitch.isPending || updatePitch.isPending}
            >
              {editingPitch ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewPitch} onOpenChange={(open) => !open && setViewPitch(null)}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Pitch Details</DialogTitle>
          </DialogHeader>
          {viewPitch && (
            <div className="space-y-3 text-sm text-slate-300">
              <div>
                <span className="text-slate-400">Name:</span> {viewPitch.name}
              </div>
              <div>
                <span className="text-slate-400">Sport:</span>{" "}
                {viewPitch.sport?.name || "N/A"}
              </div>
              <div>
                <span className="text-slate-400">City:</span>{" "}
                {viewPitch.city?.name || "N/A"}
              </div>
              <div>
                <span className="text-slate-400">Owner:</span>{" "}
                {viewPitch.owner?.name || "N/A"}
              </div>
              <div>
                <span className="text-slate-400">Location:</span>{" "}
                {viewPitch.location || "N/A"}
              </div>
              <div>
                <span className="text-slate-400">Price:</span>{" "}
                {viewPitch.price?.toLocaleString()} {viewPitch.currency}
              </div>
              <div>
                <span className="text-slate-400">Type:</span> {viewPitch.pitchType}
              </div>
              <div>
                <span className="text-slate-400">Status:</span> {viewPitch.status}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletePitch} onOpenChange={(open) => !open && setDeletePitch(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete pitch?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 border-slate-700 text-white">
              No
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (!deletePitch) return;
                removePitch.mutate(deletePitch._id);
                setDeletePitch(null);
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
