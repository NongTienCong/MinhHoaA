export const quickSortText = `// QuickSort(low, high)
  if(low < high)
    partition(low, high, pivot)
    QuickSort(low, pivot-1)
    QuickSort(pivot+1, high)

//partition(low, high, pivot)
  l = low+1
  r = high
  while(l <= r)
    while(l<=r && a[l]<=a[pivot])
      l++
    while(l<=r && a[pivot]<=a[r])
      r--
    if(l < r)
      swap(a[l], a[r])
      l++
      r--
  if(low < r)
    swap(a[low], a[r])
  pivot = r`;