"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  getDefaultGarden,
  setDefaultGarden,
} from "@/actions/gardens/gardens.actions";
import { toast } from "sonner";

interface Props {
  teamId: string;
  gardens: { garden_id: string; garden_name: string }[];
  onChange?: () => void;
}

const EditDefaultGardenDialog = ({ teamId, gardens, onChange }: Props) => {
  const [open, setOpen] = useState(false);
  const [currentDefault, setCurrentDefault] = useState<string | null>(null);
  const [newDefault, setNewDefault] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadDefault = async () => {
      if (!teamId) return;
      const { data } = await getDefaultGarden(teamId);
      setCurrentDefault(data?.garden_id ?? null);
      setNewDefault(data?.garden_id ?? null);
    };
    if (open) loadDefault();
  }, [teamId, open]);

  const handleUpdate = async () => {
    if (!newDefault || newDefault === currentDefault) {
      setOpen(false);
      return;
    }

    setLoading(true);
    try {
      await setDefaultGarden(newDefault);
      toast.success("Default garden updated!");
      setCurrentDefault(newDefault);
      onChange?.();
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update default garden");
    } finally {
      setLoading(false);
    }
  };

  const currentName = gardens.find(
    (g) => g.garden_id === currentDefault
  )?.garden_name;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="rounded-full border border-[#00A35B] px-4 py-2 text-[#00A35B] hover:bg-[#e0f4ec] text-sm font-medium">
         Default: {currentName || "None"}
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>Edit Default Garden</DialogTitle>
        <DialogDescription className="text-sm text-gray-600 mt-1">
          Current default garden:{" "}
          <span className="font-semibold text-[#00A35B]">
            {currentName || "None"}
          </span>
        </DialogDescription>

        <div className="mt-4 space-y-2">
          <label className="text-sm text-gray-700 dark:text-gray-300 font-medium">
            Select New Default
          </label>
          <Select value={newDefault || ""} onValueChange={setNewDefault}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select garden" />
            </SelectTrigger>
            <SelectContent>
              {gardens.map((garden) => (
                <SelectItem key={garden.garden_id} value={garden.garden_id}>
                  {garden.garden_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter className="mt-6">
          <button
            onClick={handleUpdate}
            disabled={loading || !newDefault || newDefault === currentDefault}
            className={`w-full rounded-full px-4 py-2 text-white ${
              loading || !newDefault || newDefault === currentDefault
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#00A35B] hover:bg-[#029b56]"
            }`}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </DialogFooter>

        <DialogClose className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default EditDefaultGardenDialog;