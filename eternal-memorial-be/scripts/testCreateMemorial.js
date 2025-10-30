(async () => {
  try {
    const FormData = global.FormData || (await import('formdata-node')).FormData
    const fetch = global.fetch || (await import('node-fetch')).default

    const form = new FormData()
    form.append('userId', '000000000000000000000000')
    form.append('name', 'Test User')
    form.append('story', 'This is a test memorial created by an automated script.')
    // Create a small dummy file as a Blob/Buffer
    const blob = new Blob([Buffer.from('fake-image-bytes')], { type: 'image/png' })
    // In node, FormData.append(name, blob, filename) may not accept Blob in older runtimes,
    // but Node 18+ supports global Blob and FormData. If not, this script may need the
    // 'form-data' npm package. We'll attempt the native approach first.
    form.append('photos', blob, 'test.png')

    const res = await fetch('http://localhost:3001/api/memorials', {
      method: 'POST',
      body: form,
      // Do NOT set Content-Type; fetch will add the correct multipart boundary header
    })

    const text = await res.text()
    console.log('Status:', res.status)
    console.log('Response:', text)
  } catch (err) {
    console.error('Test failed:', err)
    process.exit(1)
  }
})()
