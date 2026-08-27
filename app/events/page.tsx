"use client";

import { useState } from "react";
import {
  useEvents,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
  useCities,
  useSports,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Edit2, Plus } from "lucide-react";
import { toast } from "sonner";

const toDateInputValue = (value?: string) => {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
};

export default function EventsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewEvent, setViewEvent] = useState<any | null>(null);
  const [deleteEvent, setDeleteEvent] = useState<any | null>(null);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    cityId: "",
    sportId: "",
    location: "",
    date: "",
    time: "",
    description: "",
    image: null as File | null,
  });

  const filters = searchQuery ? { q: searchQuery } : undefined;
  const { data, isLoading } = useEvents(page, limit, filters);
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const removeEvent = useDeleteEvent();
  const { data: citiesData } = useCities();
  const { data: sportsData } = useSports();

  const resetForm = () => {
    setFormState({
      name: "",
      cityId: "",
      sportId: "",
      location: "",
      date: "",
      time: "",
      description: "",
      image: null,
    });
  };

  const openCreate = () => {
    resetForm();
    setEditingEvent(null);
    setIsCreateOpen(true);
  };

  const openEdit = (event: any) => {
    setEditingEvent(event);
    setFormState({
      name: event.name || "",
      cityId: event.city?._id || "",
      sportId: event.sport?._id || "",
      location: event.location || "",
      date: toDateInputValue(event.date),
      time: event.time || "",
      description: event.description || "",
      image: null,
    });
    setIsCreateOpen(true);
  };

  const submitEvent = () => {
    if (
      !formState.name ||
      !formState.cityId ||
      !formState.sportId ||
      !formState.location ||
      !formState.date ||
      !formState.time ||
      !formState.description
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    const formData = new FormData();
    formData.append("name", formState.name);
    formData.append("cityId", formState.cityId);
    formData.append("sportId", formState.sportId);
    formData.append("location", formState.location);
    formData.append("date", formState.date);
    formData.append("time", formState.time);
    formData.append("description", formState.description);
    if (formState.image) formData.append("image", formState.image);

    if (editingEvent) {
      updateEvent.mutate({ id: editingEvent._id, data: formData });
    } else {
      createEvent.mutate(formData);
    }
    setIsCreateOpen(false);
    setEditingEvent(null);
    resetForm();
  };

  const totalPages = data?.totalPages || 1;
  const cities = citiesData?.cities || [];
  const sports = sportsData?.sports || [];

  return (
    <AdminLayout>
      <div className="space-y-5 p-4 sm:space-y-6 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Event Management</h1>
            <p className="text-slate-400 mt-1">Manage all events shown in the player app</p>
          </div>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 sm:w-auto" onClick={openCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-4 border-slate-700 bg-slate-900">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Search by event name..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="pl-10 bg-slate-800 border-slate-700 text-white"
            />
          </div>
        </Card>

        {/* Table */}
        {isLoading ? (
          <TableSkeleton columns={5} rows={10} />
        ) : data?.events && data.events.length > 0 ? (
          <Card className="border-slate-700 bg-slate-900 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-800 border-slate-700">
                    <TableHead className="text-slate-300">Event Details</TableHead>
                    <TableHead className="text-slate-300">City</TableHead>
                    <TableHead className="text-slate-300">Location</TableHead>
                    <TableHead className="text-slate-300">Date &amp; Time</TableHead>
                    <TableHead className="text-right text-slate-300">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.events.map((event: any) => (
                    <TableRow key={event._id} className="border-slate-700">
                      <TableCell>
                        <div>
                          <p className="font-medium text-white">{event.name}</p>
                          <p className="text-xs text-slate-500">
                            {event.sport?.name || "N/A"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {event.city?.name || "N/A"}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {event.location}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {new Date(event.date).toLocaleDateString()} · {event.time}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-blue-400"
                            onClick={() => openEdit(event)}
                          >
                            <Edit2 className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-blue-400"
                            onClick={() => setViewEvent(event)}
                          >
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-600 text-red-400 hover:bg-red-600/10 bg-transparent"
                            onClick={() => setDeleteEvent(event)}
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
            <p className="text-slate-400">No events found</p>
          </Card>
        )}

        {/* Pagination */}
        {data?.events && data.events.length > 0 && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Page {page} of {totalPages} ({data?.total} total events)
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
            <DialogTitle>{editingEvent ? "Update Event" : "Add Event"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Event name"
              value={formState.name}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              className="bg-slate-800 border-slate-700 text-white md:col-span-2"
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
            <Input
              placeholder="Location"
              value={formState.location}
              onChange={(e) => setFormState({ ...formState, location: e.target.value })}
              className="bg-slate-800 border-slate-700 text-white md:col-span-2"
            />
            <Input
              type="date"
              value={formState.date}
              onChange={(e) => setFormState({ ...formState, date: e.target.value })}
              className="bg-slate-800 border-slate-700 text-white"
            />
            <Input
              type="time"
              value={formState.time}
              onChange={(e) => setFormState({ ...formState, time: e.target.value })}
              className="bg-slate-800 border-slate-700 text-white"
            />
            <textarea
              placeholder="Description"
              value={formState.description}
              onChange={(e) =>
                setFormState({ ...formState, description: e.target.value })
              }
              rows={4}
              className="md:col-span-2 rounded-md bg-slate-800 border border-slate-700 text-white px-3 py-2 text-sm placeholder:text-slate-500"
            />
            <Input
              type="file"
              accept="image/*"
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
              onClick={submitEvent}
              disabled={createEvent.isPending || updateEvent.isPending}
            >
              {editingEvent ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewEvent} onOpenChange={(open) => !open && setViewEvent(null)}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Event Information</DialogTitle>
          </DialogHeader>

          {viewEvent && (
            <div className="space-y-6 pt-2">
              <div className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="w-20 h-20 rounded-md overflow-hidden bg-slate-700 shrink-0">
                  {viewEvent.image?.url ? (
                    <img
                      src={viewEvent.image.url}
                      alt={viewEvent.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                      No Image
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold leading-tight">{viewEvent.name}</h3>
                  <p className="text-sm text-blue-400 capitalize">
                    {viewEvent.sport?.name || "N/A"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                    City
                  </p>
                  <p className="text-slate-200 capitalize">
                    {viewEvent.city?.name || "N/A"}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                    Date &amp; Time
                  </p>
                  <p className="text-slate-200">
                    {new Date(viewEvent.date).toLocaleDateString()} · {viewEvent.time}
                  </p>
                </div>

                <div className="col-span-2 space-y-1">
                  <p className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                    Location
                  </p>
                  <p className="text-slate-200">{viewEvent.location || "N/A"}</p>
                </div>

                <div className="col-span-2 space-y-1">
                  <p className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                    Description
                  </p>
                  <p className="text-slate-200">{viewEvent.description || "N/A"}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-between text-[10px] text-slate-500 uppercase tracking-tighter">
                <span>Added: {new Date(viewEvent.createdAt).toLocaleDateString()}</span>
                <span>ID: {viewEvent._id.slice(-8)}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteEvent} onOpenChange={(open) => !open && setDeleteEvent(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete event?</AlertDialogTitle>
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
                if (!deleteEvent) return;
                removeEvent.mutate(deleteEvent._id);
                setDeleteEvent(null);
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
