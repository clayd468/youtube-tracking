import { Button } from "@/components/ui/button";
import Link from "@/components/ui/link";
import { getColorStatus } from "@/utils/get-color-status";
import { ColumnDef } from "@tanstack/react-table";
import { LucideEye, Trash2 } from "lucide-react";

export const columns: ColumnDef<IDataTables>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
  },
  {
    accessorKey: "url",
    header: "Url",
    cell: ({ row }) => (
      <div className="max-w-[400px] overflow-hidden">
        <Link target="_blank" to={row.getValue("url")}>
          {row.getValue("url")}
        </Link>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const color = getColorStatus(status);
      return (
        <div
          className={`px-2 py-1 rounded-full text-white text-center ${color}`}
        >
          {status}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Action",
    cell: ({ row }) => {
      const id = row.getValue("id");
      return (
        <div className="flex gap-1">
          <Button
            asChild
            variant="outline"
            className="h-8 w-8 p-2 bg-blue hover:bg-blue/80"
            title="View Detail"
          >
            <Link className="text" to={`/${id}`}>
              <LucideEye className="text-white" size={15} />
            </Link>
          </Button>
          <Button
            variant="destructive"
            className="h-8 w-8 p-2"
            onClick={() => console.log("delete")}
            title="Delete"
          >
            <Trash2 size={15} />
          </Button>
        </div>
      );
    },
  },
];
