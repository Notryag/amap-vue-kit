<script setup lang="ts">
import HawkEyeDemo from '../../examples/basic/src/HawkEyeDemo.vue'
import { useDemoLoader } from './useDemoLoader'

const { hasKey } = useDemoLoader()
</script>

<template>
  <HawkEyeDemo :enabled="hasKey" />
</template>
