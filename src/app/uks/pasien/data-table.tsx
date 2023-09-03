"use client";

import { useState } from "react";
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog"

import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
	ContextMenuSeparator,
} from "@/components/ui/context-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { addTotalCheckUp } from "@/actions/checkup-action";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	onAdd?: () => void;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	onAdd,
}: DataTableProps<TData, TValue>) {
	const [modalTotal, setModalTotal] = useState(false);
	const [totalData, setTotalData] = useState({});
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	const handleAddTotal = async (formData: FormData) => {
		let data: any = {}

		data.paymentTotal = formData.get("total")
		//@ts-ignore
		data.id = totalData.id!
		await addTotalCheckUp(data)

		setModalTotal(false)

	}



	return (
		<div>
			<Dialog open={modalTotal} onOpenChange={() => setModalTotal(!modalTotal)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Tambah Total Pembayaran</DialogTitle>
					</DialogHeader>
					<form action={handleAddTotal} className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="total" className="text-right">
								Total
							</Label>
							<Input
								placeholder="Total"
								autoComplete="off"
								id="total"
								name="total"
								className="col-span-3"
								type="number"

							/>

						</div>
						<Button type="submit">Save Data</Button>
					</form>
				</DialogContent>
			</Dialog>



			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									className="even:bg-background odd:bg-accent py-2 focus:bg-slate-300 select-none"
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell className="whitespace-nowrap" key={cell.id}>
											<ContextMenu>
												<ContextMenuTrigger>
													{flexRender(
														cell.column.columnDef.cell,
														cell.getContext(),
													)}
												</ContextMenuTrigger>
												<ContextMenuContent>
													<ContextMenuItem>Rawat Inap</ContextMenuItem>
													{/*@ts-ignore*/}
													{!row.original?.payment_total && (
														<>
															<ContextMenuItem
																onClick={() => {
																	//@ts-ignore
																	setTotalData(row.original)
																	setModalTotal(true);
																}}
															>
																Tambah Total
															</ContextMenuItem>

														</>
													)}
		{/*@ts-ignore*/}
													{row.original.status !== "lunas" ? (
														<ContextMenuItem>Bayar</ContextMenuItem>) : ""}
												</ContextMenuContent>
											</ContextMenu>
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
