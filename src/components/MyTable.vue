<script setup lang='ts'>
import {computed, onBeforeMount, onMounted, onUpdated, ref} from 'vue';
import {type ColumnDef, getCoreRowModel, type Table, useVueTable} from '@tanstack/vue-table';
import {storeToRefs} from 'pinia';
import {useDataStore} from '@/stores/dataStore'; // Adjust path as needed

interface Money {
  amount: number;
  currency: string;
}

// Define the type of data you're working with
interface Allocation {
  creator_id: string;
  amount: Money;
  created_at: string;
}

// 1. Access the Pinia store
const dataStore = useDataStore();

// 2. Define Columns with types
const columns: ColumnDef<Allocation>[] = [
  {
    header: 'ID',
    accessorKey: 'creator_id',
  },
  {
    header: 'Created At',
    accessorKey: 'created_at',
  },
];

// 3. Create the Table Instance with types
const table: Table<Allocation> = useVueTable<Allocation>({
  data: computed(()=> dataStore.data),
  get columns() {
    return columns;
  },
  getCoreRowModel: getCoreRowModel(),
});

onMounted(()=>{
  dataStore.fetchData();
  console.log('onBeforeMount',dataStore.data.length);
})
</script>

<template>
  <div v-if='dataStore.isLoading' class='loading'>Loading...</div>
  <div v-else>
    <table border='1'>
      <thead>
      <tr v-for='headerGroup in table.getHeaderGroups()' :key='headerGroup.id'>
        <th
            v-for='header in headerGroup.headers'
            :key='header.id'
        >
          {{ header.isPlaceholder ? '' : header.column.columnDef.header }}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for='row in table.getRowModel().rows' :key='row.id'>
        <td v-for='cell in row.getVisibleCells()' :key='cell.id'>
          {{ cell.getValue() }}
        </td>
      </tr>
      </tbody>
    </table>
  </div>
<!--  <li v-for='a in dataStore.data' :key='a.creator_id'>{{ a.creator_id }}</li>-->
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

th,
td {
  padding: 0.5rem;
  text-align: left;
  border: 1px solid #ccc;
}

th {
  background-color: #f0f0f0;
  font-weight: bold;
}
</style>