import { ApiProperty } from '@nestjs/swagger';

export class CreateComponentDto {
  @ApiProperty({
    example: 'Button',
    description: 'Tên component (có thể trùng với type)',
    required: false,
  })
  title?: string;

  @ApiProperty({
    example: 'button',
    description: 'Kiểu component (bắt buộc)',
    enum: [
      'button',
      'toggle',
      'checkbox',
      'card',
      'loader',
      'input',
      'form',
      'pattern',
      'radio',
      'tooltip',
    ],
  })
  type: string;

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
    description: 'Account ID (backend tự gán từ JWT)',
    required: false,
  })
  accountId?: string;

  @ApiProperty({
    example: 'ui-basic',
    description: 'Category ID chứa component',
    required: false,
  })
  categoryId?: string;

  @ApiProperty({
    example: 'draft',
    enum: ['draft', 'review', 'public', 'rejected'],
    required: false,
  })
  status?: 'draft' | 'review' | 'public' | 'rejected';
}
