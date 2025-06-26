# Vue 3 + TypeScript + Vite

### How to configure vue-table to render Pinia data correctly

I struggled for way to long trying to get my pinia stores to work as a reactive source for tanstack table with the `vue-table` adapter.

This repo is the result of trying to pin down why it was not working and how I could get it to work.

In the end all you really need to know is this part:

```go
const table: Table<Allocation> = useVueTable<Allocation>({
   data: computed(()=> dataStore.data),
   get columns() {
      return columns;
   },
   getCoreRowModel: getCoreRowModel(),
});
```

the line that fixed my problem with the data rendering once and then disappearing until I changed something
and HMR triggered and it would re-render is:

```go
data: computed(()=> dataStore.data),
```

Digging thru a bunch of threads on reactivity breaking things massively back in 2024 and I found this link.

https://github.com/TanStack/table/pull/5687#issuecomment-2281067245

At the bottom of that post by @OlaAlsaker they mention 

> I find myself having to use computed most of the time anyway,

And that is what triggered my attempt to use `computed` and it works.
