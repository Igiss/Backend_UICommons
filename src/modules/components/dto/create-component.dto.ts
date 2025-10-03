import { ApiProperty } from '@nestjs/swagger';

export class CreateComponentDto {
  @ApiProperty({
    example: 'Button',
    description: 'Tên component',
  })
  title: string;

  @ApiProperty({
    example: '<button>Click</button>',
    description: 'HTML code của component',
  })
  htmlCode: string;

  @ApiProperty({
    example: 'button { color: red; }',
    description: 'CSS code của component',
  })
  cssCode: string;

  @ApiProperty({
    example: '<Button>Click</Button>',
    description: 'React code (optional)',
    required: false,
  })
  reactCode?: string;

  @ApiProperty({
    example: '<template><button>Click</button></template>',
    description: 'Vue code (optional)',
    required: false,
  })
  vueCode?: string;

  @ApiProperty({
    example: 'html`<button>Click</button>`',
    description: 'Lit code (optional)',
    required: false,
  })
  litCode?: string;

  @ApiProperty({
    example: '<script>export let text="Click"</script><button>{text}</button>',
    description: 'Svelte code (optional)',
    required: false,
  })
  svelteCode?: string;

  @ApiProperty({
    example: 'f3a6d2b8-47d2-4f7c-8fcd-45aefb0d9c62',
    description: 'ID của Account tạo component',
  })
  accountId: string;
}
