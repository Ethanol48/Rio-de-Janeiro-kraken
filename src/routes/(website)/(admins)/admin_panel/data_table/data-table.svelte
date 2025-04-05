<script lang="ts">
	import {
		createTable,
		Render,
		Subscribe,
		createRender,
		type DataLabel,
		BodyRow,
		DataColumn
	} from 'svelte-headless-table';
	import { readable } from 'svelte/store';
	import * as Table from '$lib/components/ui/table';
	import DataTableActions from './data-table-actions.svelte';
	import {
		addPagination,
		addSortBy,
		addTableFilter,
		addHiddenColumns,
		addSelectedRows
	} from 'svelte-headless-table/plugins';
	import { Button } from '$lib/components/ui/button';
	import ArrowUpDown from '@lucide/svelte/icons/arrow-up-down';
	import { Input } from '$lib/components/ui/input';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import DataTableCheckbox from './data-table-checkbox.svelte';
	import MenuSelect from './MenuSelect.svelte';
	import EditableCell from './EditableCell.svelte';
	import { type User } from '$lib/server/db/schema';
	import CheckboxCell from './CheckboxCell.svelte';

	type UserTable = Omit<User, 'passwordHash'>;

	let { users }: { users: UserTable[] } = $props();

	const table = createTable(readable(users), {
		page: addPagination(),
		sort: addSortBy(),
		filter: addTableFilter({
			fn: ({ filterValue, value }) => value.toLowerCase().includes(filterValue.toLowerCase())
		}),
		hide: addHiddenColumns(),
		select: addSelectedRows()
	});

	const updateData = (
		rowDataId: BodyRow<UserTable>,
		columnId: DataColumn<UserTable>,
		newValue: any
	) => {
		if (columnId.id === 'points') {
			console.log('Changing points!!!');
		}

		fetch(
			'/admin_panel?' +
				new URLSearchParams({ operation: columnId, value: newValue, userId: rowDataId }).toString(),
			{
				method: 'POST'
			}
		);
		// Handle any server-synchronization.
	};

	const EditableCellLabel: DataLabel<UserTable> = ({ column, row, value }) =>
		createRender(EditableCell, { row, column, value, onUpdateValue: updateData });

	const columns = table.createColumns([
		table.column({
			accessor: 'id',
			header: (_, { pluginStates }) => {
				const { allPageRowsSelected } = pluginStates.select;
				return createRender(DataTableCheckbox, {
					checked: allPageRowsSelected
				});
			},
			cell: ({ row }, { pluginStates }) => {
				const { getRowState } = pluginStates.select;
				const { isSelected } = getRowState(row);

				return createRender(DataTableCheckbox, {
					checked: isSelected
				});
			},
			plugins: {
				sort: {
					disable: true
				},
				filter: {
					exclude: true
				},
				select: {}
			}
		}),
		table.column({
			accessor: 'username',
			header: 'Username',
			plugins: {
				sort: {
					disable: false
				},
				filter: {
					exclude: false
				}
			}
		}),

		table.column({
			accessor: 'login',
			header: 'Login',
			plugins: {
				sort: {
					disable: false
				},
				filter: {
					exclude: false
				}
			}
		}),
		table.column({
			accessor: 'points',
			header: 'Points',
			cell: EditableCellLabel,
			plugins: {
				sort: {
					disable: false
				},
				filter: {
					exclude: true
				}
			}
		}),

		table.column({
			accessor: 'wantToClaim',
			header: 'Requested order',
			cell: ({ value }) => {
				return createRender(CheckboxCell, { checked: value });
			},
			plugins: {
				sort: {
					disable: false
				},
				filter: {
					exclude: true
				}
			}
		}),

		table.column({
			accessor: 'claimedOrders',
			header: 'Claimed order',
			cell: ({ value }) => {
				return createRender(CheckboxCell, { checked: value });
			},
			plugins: {
				sort: {
					disable: false
				},
				filter: {
					exclude: true
				}
			}
		}),

		table.column({
			accessor: 'isAdmin',
			header: 'Admin',
			cell: ({ value }) => {
				return createRender(CheckboxCell, { checked: value });
			},
			plugins: {
				sort: {
					disable: false
				},
				filter: {
					exclude: true
				}
			}
		}),

		table.column({
			accessor: ({ id }) => id,
			header: '',
			cell: (item) => {
				return createRender(DataTableActions, {
					id: item.value,
					row: item.row
					//rowState: item.row.state?.data,
					//rowIndex: item.row.id
				});
			},
			plugins: {
				sort: {
					disable: true
				},
				filter: {
					exclude: true
				}
			}
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates, flatColumns, rows } =
		table.createViewModel(columns, {
			rowDataId: (row) => row.id
		});

	// plugin state
	const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
	const { filterValue } = pluginStates.filter;
	const { hiddenColumnIds } = pluginStates.hide;
	const { selectedDataIds } = pluginStates.select;

	const ids = flatColumns.map((col) => col.id);
	const hideIdsStart = ['wantToClaim', 'claimedOrders'];

	let hideForId = $state(
		Object.fromEntries(
			ids.map((id) => {
				if (hideIdsStart.includes(id)) return [id, false];
				else return [id, true];
			})
		)
	);

	$effect(() => {
		$hiddenColumnIds = Object.entries(hideForId)
			.filter(([, hide]) => !hide)
			.map(([id]) => id);
	});

	const hidableCols = ['login', 'points', 'username', 'claimedOrders', 'wantToClaim'];
</script>

<div class="flex w-8/12 flex-col">
	<div class="flex items-center py-4">
		<Input
			class="max-w-sm bg-background"
			placeholder="Filter by email and login..."
			type="text"
			bind:value={$filterValue}
		/>

		<div class="ml-auto flex">
			<div class="mr-4">
				{#if Object.keys($selectedDataIds).length > 0}
					<MenuSelect selected={selectedDataIds} />
				{/if}
			</div>

			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button variant="outline" builders={[builder]}>
						Columns <ChevronDown class="ml-2 h-4 w-4" />
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					{#each flatColumns as col}
						{#if hidableCols.includes(col.id)}
							<DropdownMenu.CheckboxItem bind:checked={hideForId[col.id]}>
								{col.header}
							</DropdownMenu.CheckboxItem>
						{/if}
					{/each}
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</div>
	<div class="rounded-md border bg-background">
		<Table.Root {...$tableAttrs}>
			<Table.Header>
				{#each $headerRows as headerRow}
					<Subscribe rowAttrs={headerRow.attrs()}>
						<Table.Row>
							{#each headerRow.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
									<Table.Head {...attrs} class="[&:has([role=checkbox])]:pl-3">
										{#if cell.id === 'points' || cell.id === 'login' || cell.id === 'username'}
											<Button variant="ghost" on:click={props.sort.toggle}>
												<Render of={cell.render()} />
												<ArrowUpDown class={'ml-2 h-4 w-4'} />
											</Button>
										{:else}
											<Render of={cell.render()} />
										{/if}
									</Table.Head>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Header>
			<Table.Body {...$tableBodyAttrs}>
				{#each $pageRows as row (row.id)}
					<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
						<Table.Row {...rowAttrs} data-state={$selectedDataIds[row.id] && 'selected'}>
							{#each row.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs>
									<Table.Cell {...attrs}>
										<Render of={cell.render()} />
									</Table.Cell>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>

	<div class="flex items-center justify-end space-x-4 py-4">
		<div class="flex-1 text-sm">
			{Object.keys($selectedDataIds).length} of{' '}
			{$rows.length} row(s) selected.

			{#if $rows.length > 0}
				<!-- content here -->
			{/if}
		</div>
		<Button
			variant="outline"
			size="sm"
			on:click={() => ($pageIndex = $pageIndex - 1)}
			disabled={!$hasPreviousPage}>Previous</Button
		>
		<Button
			variant="outline"
			size="sm"
			disabled={!$hasNextPage}
			on:click={() => ($pageIndex = $pageIndex + 1)}>Next</Button
		>
	</div>
</div>
