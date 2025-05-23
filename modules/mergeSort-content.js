export const mergeSortText = `// mergeSort(a[], low, high)
  if(low < high)
    mid = (low + high) / 2
    mergeSort(a[], low, mid)
    mergeSort(a[], mid+1, high)
    merge(a[], low, mid, high)

//merge(a[], left, mid, right)
  n1 = mid - left + 1;
  n2 = right - mid;
  L[1...n1]
  R[1...n2]
  for(i = 0; i < n1; i++)
    L[i] = a[left + i]
  for(j = 0; j < n2; j++)
    R[j] = a[mid + 1 + j]
  i = 0
  j = 0
  k = left
  while(i < n1 && j < n2)
    if(L[i] <= R[j])
      a[k] = L[i]
      i++
    else
      a[k] = R[j]
      j++
    k++
  while(i < n1)
    a[k] = L[i]
    i++
    k++
  while(j < n2)
    a[k] = R[j]
    j++
    k++`;